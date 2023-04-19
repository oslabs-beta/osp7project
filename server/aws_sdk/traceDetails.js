require('dotenv').config();

const {
  XRayClient,
  GetTraceSummariesCommand,
  BatchGetTracesCommand,
} = require('@aws-sdk/client-xray');
const {
  CloudWatchLogsClient,
  FilterLogEventsCommand,
} = require('@aws-sdk/client-cloudwatch-logs');
const aws = require('aws-sdk');
const main = require('./sortingSegments');
const { RedisFlushModes } = require('redis');

// const awsCredentials = {
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// };

// only needed if issues with aws cli
// process.env.AWS_ACCESS_KEY_ID = awsCredentials.accessKeyId;
// process.env.AWS_SECRET_ACCESS_KEY = awsCredentials.secretAccessKey;

// const xClient = new XRayClient(awsCredentials);

// console.log(getTraceSummary());

// will return an array of traceIds.
// getTraceSummary()
//   .then((result) => {
//     console.log(result);
//     const traceArr = result.TraceSummaries;
//     const traceIds = traceArr.map((node) => {
//       return node.Id;
//     });
//     return traceIds;
//   })
//   .catch((err) => {
//     console.log(err, 'err in getTraceSummary');
//   });

//below will give you the subsegments for each traceId

// getTraceDetails(traceId)
//   .then((result) => {
//     console.log(result.Traces[0].Segments);
//   })
//   .catch((err) => {
//     console.log(err, ' in gettracedetails');
//   });

console.log('out of get logs');
const getTraceMiddleware = {
  getSummary: async (req, res, next) => {
    console.log('in getTraceMiddleware');

    const xClient = new XRayClient({
      credentials: res.locals.awsCredentials,
      region: 'us-east-1',
    });
    // experimental below
    // async function getLogs(traceId, logGroupName) {
    //   const endTime = new Date();
    //   const startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000);

    //   const cloudwatchlogs = new aws.CloudWatchLogs({
    //     credentials: res.locals.awsCredentials,
    //     region: 'us-east-1',
    //   });

    //   console.log(endTime, 'loggin the endtime');

    //   // original params
    //   const params = {
    //     logGroupName,
    //     // filterPattern: `{ $.message = "*${traceId}*" }`,
    //     startTime: startTime.getTime(),
    //     endTime: endTime.getTime(),
    //   };

    //   // original try
    //   try {
    //     const data = await cloudwatchlogs.filterLogEvents(params).promise();
    //     console.log(data);
    //     data.events.forEach((segEvent) => {
    //       // console.log(Object.keys(segEvent));
    //       console.log(segEvent.logStreamName, '\n', segEvent.message);
    //       // console.log(segEvent.message);
    //     });
    //   } catch (error) {
    //     console.error('Error fetching logs:', error);
    //   }
    // }

    // about to call get logs
    // console.log('going to get logs ');
    // const result = await getLogs(
    //   '1-643ee6f7-40318f28775180c735c8fb77',
    //   '/aws/lambda/todo-list-app-dev-deleteTask'
    // );
    // console.log('out of get logs');

    // along with cloud watch experimental
    const getTraceSummary = async () => {
      console.log('in getTracesummary');
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000);

      const params = {
        StartTime: startTime,
        EndTime: endTime,
      };

      const response = await xClient.send(new GetTraceSummariesCommand(params));

      return response;
    };
    // get the data in xray. will return an array on res
    try {
      const result = await getTraceSummary();
      const traceArray = result.TraceSummaries;
      const traceIds = traceArray.map((node) => {
        // console.log(node);
        // get arn for each node
        // console.log(node.ResourceARNs[1]);
        // console.log(node.Id);
        return node.Id;
      });
      // console.log(traceIds);
      res.locals.traceArray = traceIds;
      next();
    } catch (err) {
      next(err);
    }
  },

  // get segment data
  getSegmentArray: async (req, res, next) => {
    console.log('in getSegmentArray');
    const xClient = new XRayClient({
      credentials: res.locals.awsCredentials,
      region: 'us-east-1',
    });
    const getTraceDetails = async (traceIds) => {
      const params = {
        TraceIds: traceIds,
      };

      const response = await xClient.send(new BatchGetTracesCommand(params));
      return response;
    };
    try {
      let fullTraceArray = [];

      const currTraceIds = [];
      while (res.locals.traceArray.length) {
        if (currTraceIds.length < 5)
          currTraceIds.push(res.locals.traceArray.shift());
        else {
          const result = await getTraceDetails(currTraceIds);
          fullTraceArray = fullTraceArray.concat(result.Traces);
          currTraceIds = [];
        }
      }
      if (currTraceIds.length > 0) {
        const result = await getTraceDetails(currTraceIds);
        fullTraceArray = fullTraceArray.concat(result.Traces);
      }
      // console.log(fullTraceArray, 'this is full trace array');
      res.locals.traceSegmentData = fullTraceArray;
      next();
    } catch (err) {
      next(err);
    }
  },

  sortSegments: async (req, res, next) => {
    console.log('in sortedSegments');
    try {
      const allNodes = [];
      // traceIds can be found at the element

      for (let i = 0; i < res.locals.traceSegmentData.length; i++) {
        const currSegment = res.locals.traceSegmentData[i].Segments;
        // console.log(currSegment);
        const currRoot = main(currSegment);

        // below is the process to get the logs for the lambda functions
        // currRoot[0] is the node
        let currentAllSegments = currRoot[1];

        if (currentAllSegments.length) {
          for (let i = 0; i < currentAllSegments.length; i++) {
            if (
              currentAllSegments[i].Document.origin === 'AWS::Lambda' &&
              currentAllSegments[i].Document.aws.request_id
            ) {
              let requestId = currentAllSegments[i].Document.aws.request_id;
              let segmentName = `/aws/lambda/${currentAllSegments[i].Document.name}`;
              // await getLogs();
              console.log(requestId, ' ', segmentName);

              // call the functino for get logs in here and add the to the node
              // add the logs onto currRoot[0].logs = logs or something

              const logs = await getLogs(requestId, segmentName);
              currRoot[0].logs = logs;
            }
          }
        }
        allNodes.push(currRoot[0]);
      }

      async function getLogs(requestId, logGroupName) {
        const endTime = new Date();
        const startTime = new Date(endTime.getTime() - 60 * 60 * 1000);

        const cloudwatchlogs = new CloudWatchLogsClient({
          credentials: res.locals.awsCredentials,
          region: 'us-east-1',
        });

        const params = {
          logGroupName,

          startTime: startTime.getTime(),
          endTime: endTime.getTime(),

          // filter:
        };

        const command = new FilterLogEventsCommand(params);

        try {
          const data = await cloudwatchlogs.send(command);
          console.log(data, 'this is the data');
          const node_logs = data.events.filter((segEvent) => {
            return segEvent.message.includes(requestId);
          });
          return node_logs;
        } catch (error) {
          console.error('Error fetching logs:', error);
        }
      }
      res.locals.nodes = allNodes;
      next();
    } catch (err) {
      next(err);
    }
  },
};

module.exports = getTraceMiddleware;
