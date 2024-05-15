# LambdaPulse README


## Product Description

LambdaPulse is a simplified, streamlined tool to view the health of your AWS Lambda Functions.


## Instructions

LambdaPulse functions best as a (currently free) SaaS tool, accessible via the URL in our About section.
However, if you'd like to fork & host your own local copy of LambdaPulse, instructions are provided below.

### Option A: Sign up as a user!
1) Go to http://lambdapulse.com
2) Sign Up
3) Go into Settings and enter your ARN
4) Go into Traces and click the Refresh icon

### Option B: Dev Installation Instructions
1) Git clone
2) install redis-server via apt/brew/etc
3) npm install in /
4) In .env, set up the following:
    AWS_ACCESS_KEY_ID
    AWS_SECRET_ACCESS_KEY
    USER_ROLE_ARN
    JWT_KEY
    PG_URI
    -also a separate .env in client folder, setup VITE_CAPTCHA_KEY = "google captchav2 key"
5) install redis-server via apt/brew/etc
#) Update vite.config.js to change port to something other than 3000
#) Update package.json fulldev to add NODE_ENV = dev
#) Run SQL scripts.md in your postgres database
6) npm run fulldev
7) create user and enter ARN in settings
8) refresh data


## How to Contribute

| Feature                                                                               | Status    |
|---------------------------------------------------------------------------------------|-----------|
| Ingest traces from AWS                                               | ✅        |
| Display tree graph of traces and application      | ✅        |
| Display logs and trace details                                                                      | ✅        |
| Hyperlink into logs                                                                  | 🙏🏻        |
| Filter logs on click in node graph                                                                  | 🙏🏻        |
| Change tree graph to a network to better show crossover between traces                                 | 🙏🏻        |
| Refactor to use Typescript                                                         | 🙏🏻        |
| Add more metrics to dashboard                                                         | 🙏🏻        |

- ✅ = Ready to use
- ⏳ = In progress
- 🙏🏻 = Looking for contributors
    

## Contributor Information

  <table>
  <tr>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/104728705?v=4" width="140px;" alt=""/>
      <br />
      <sub><b>Andrii Karpenko</b></sub>
      <br />
      <a href="https://www.linkedin.com/in/andrii-karpenko/">🖇️</a>
      <a href="https://github.com/karpuxa">🐙</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/108209021?v=4" width="140px;" alt=""/>
      <br />
      <sub><b>Jacob Alarcon</b></sub>
      <br />
      <a href="#">🖇️</a>
      <a href="https://github.com/jacobalarcon">🐙</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/43285867?v=4" width="140px;" alt=""/>
      <br />
      <sub><b>Bryent Sariwati</b></sub>
      <br />
      <a href="https://www.linkedin.com/in/bryent-sariwati-4072a1181/">🖇️</a>
      <a href="https://github.com/bryentsariwati">🐙</a>
    </td>
     <td align="center">
      <img src="https://avatars.githubusercontent.com/u/115170851?v=4" width="140px;" alt=""/>
      <br />
      <sub><b>Matt Lusby</b></sub>
      <br />
      <a href="https://www.linkedin.com/in/matt-lusby/">🖇️</a>
      <a href="https://github.com/lusmattg">🐙</a>
    </td>
  </table>

- 💻 = Website
- 🖇️ = LinkedIn
- 🐙 = Github


## Press & Publications
