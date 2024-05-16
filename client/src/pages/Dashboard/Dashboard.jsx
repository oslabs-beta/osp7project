import { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import EventGraph from '../../components/EventGraph';
import HomeDisplay from '../../components/HomeDisplay';
import TraceList from '../../components/TraceList';
import Metrics from '../../components/Metrics';
import Settings from '../../components/Settings';
import { Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import sampleTraces from '../../assets/sampleTraces.json';
import ComingSoon from '../ComingSoon'

import homeIcon from '../../assets/home-1391-svgrepo-com.svg';
import eventGraphIcon from '../../assets/network-2-1118-svgrepo-com.svg';
import traceListIcon from '../../assets/list-svgrepo-com.svg';
import metricsIcon from '../../assets/chart-bar-svgrepo-com.svg';
import teamIcon from '../../assets/team-svgrepo-com.svg';
import settingsIcon from '../../assets/settings-svgrepo-com.svg';
import mapIcon from '../../assets/map-svgrepo-com.svg'
import logoutIcon from '../../assets/logout-svgrepo-com.svg';

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('Home');
  const [currentTrace, setCurrentTrace] = useState(0);
  const [traceList, setTraceList] = useState({});
  const [nodeData, setNodeData] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appTreeNode, setAppTreeNode] = useState({});
  const [appLogs, setAppLogs] = useState([]);
  const [start_value, onChangeStart] = useState(new Date(new Date()-1000*60*60*24*7));
  const [end_value, onChangeEnd] = useState(new Date());

  const navigate = useNavigate();


  useEffect(() => {
    console.log('FIRED OFF USEFFECT');
    setLoading(true);
    fetch('/getTraces', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((result) => {
        if (result.status === 419) {
          navigate('/');
        }
        return result.json()
      })
      .then((data) => {
        setLoading(false);
        if (data.length) {
          setNodeData(data[currentTrace]);
          setTraceList(data);
        } else {
          console.log('Fetched nothing, defaulting to placeholder data');
          setNodeData(sampleTraces[currentTrace]);
          setTraceList(sampleTraces);
        }
      })
      .catch((err) => console.log(err));
  }, [refresh]);

  useEffect(() => {
    setNodeData(traceList[currentTrace]);
  }, [currentTrace]);

  useEffect(() => {
    //get from right
    const getFromRight = (s) => {
      let result = '';
      for (let i = s.length-1; i >= 0; i--) {
        if (s[i] == '/') return result;
        result = s[i] + result;
      }
      return result;
    }
    let newAppChildren = [];
    //loop thru tracelist get endpt
    for (let n = 0; n < traceList.length; n++) {
      const url = traceList[n].fullData.Document.http.request.url;
      const endpt = getFromRight(url)
      // let errors = findErrorsInTrace(traceList[n]);

      //ADDING TO APP TREE CHILDREN

      let found = false;
      // console.log(`this is trace${n} endpt`, endpt)
      //loop thru children get endpt
      for (let j = 0; j < newAppChildren.length; j++) {
        let appChildrenUrl = newAppChildren[j].fullData.Document.http.request.url;
        let appChildrenEndpt = getFromRight(appChildrenUrl)
        // console.log(`this is appchild${j} endpt`, appChildrenEndpt)
        if (appChildrenEndpt == endpt) {
          found = true;
        }
      }
      if (!found) {
        // console.log('shud b adding')
        newAppChildren.push(traceList[n]);
      }
    }
    console.log('this is apptreechildren',newAppChildren);
    let logs = [];
    for (let i = 0; i < newAppChildren.length; i++){
      logs=[...logs,...traceList[i].logs]
    }
    let client = {
      id :'client',
      name:'client',
      logs: logs,
      children: newAppChildren,
      origin: 'client',
      //fulldata, has .Document
    }
    setAppTreeNode(client);
    //ADDING TO APP TREE CHILDREN
    setAppLogs(logs);
    console.log('this is logs: ', logs);
    if (newAppChildren.length!= 0) {
      console.log(newAppChildren[0].fullData.Document)

    }

  }, [traceList])

  function logout() {
    fetch('/logout', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
    .then((response) => {
      if(response.status === 200) {
        navigate('/');
      }
    })
  }

  function Body() {
    return (
      <div className='body'>
        {currentPage === 'Home' && (
          <HomeDisplay traces={traceList} currentTrace={currentTrace} loading={loading} />
        )}
        {currentPage === 'EventGraph' && (
          <EventGraph
            nodeData={nodeData}
            traceLogData={traceList[currentTrace].logs}
          />
        )}
        {currentPage === 'AppTree' && (
          <EventGraph
            nodeData={appTreeNode}
            traceLogData={appLogs}
          />
        )}
        {currentPage === 'TraceList' && (
          <TraceList
            traces={traceList}
            setCurrentTrace={setCurrentTrace}
            setRefresh={setRefresh}
            refresh={refresh}
            loading={loading}
            currentTrace={currentTrace}
            start_value={start_value}
            onChangeStart={onChangeStart}
            end_value={end_value}
            onChangeEnd={onChangeEnd}
          />
        )}
        {currentPage === 'Metrics' && (
          <ComingSoon/>
        )}
        {currentPage === 'Team' && (
          <ComingSoon/>
        )}
        {currentPage === 'Settings' && (
          <Settings/>
        )}
      </div>
    );
  }
  return (
    <div>
      <NavBar />
      <div className='flex'>
        <div className='p-1 w-[3vw] flex flex-col text-center'>
          <button 
            className='p-1 bg-transparent'
            onClick={() => setCurrentPage('Home')} title='Home'>
            <img src={homeIcon} width='16px'></img>
          </button>
          <button 
            className='p-1 bg-transparent'
            onClick={() => setCurrentPage('EventGraph')} title='Event Graph'>
            <img src={eventGraphIcon} width='16px'></img>
          </button>
          <button 
            className='p-1 bg-transparent'
            onClick={() => setCurrentPage('AppTree')}>
            <img src={mapIcon} width='16px'></img>
          </button>
          <button 
            className='p-1 bg-transparent'
            onClick={() => setCurrentPage('TraceList')}>
            <img src={traceListIcon} width='16px'></img>
          </button>
          <button 
            className='p-1 bg-transparent'
            onClick={() => setCurrentPage('Metrics')} title='Metrics'>
            <img src={metricsIcon} width='16px'></img>
          </button>
          <button 
            className='p-1 bg-transparent'
            onClick={() => setCurrentPage('Team')} title='Team'>
            <img src={teamIcon} width='16px'></img>
          </button>
          <button 
            className='p-1 bg-transparent'
            onClick={() => setCurrentPage('Settings')}>
            <img src={settingsIcon} width='16px'></img>
          </button>
          <button 
            className='p-1 bg-transparent'
            onClick={()=>logout()} title='Logout'>
            <img src={logoutIcon} width='16px'></img>
          </button>
        </div>
        <div className='w-[94vw] bg-neutral-900'>
          <Body />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
