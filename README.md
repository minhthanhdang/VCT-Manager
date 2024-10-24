# VCT Esports Manager Notes

 ## How it works & Architecture
  - AWS Bedrock agent handle the question answer part. The agent has the knowledge base and action groups to work with (see below). It's initial instruction is also really clear and provide a lot of information about Valorant.
  - Claude 3 Sonnet is used as the foundation model.
  - In Orchestration setting, an example is provided in the template.
  - Next.js application invoke the BedrockAgentRuntime to get the response, using Javascript SDK.
  - The Agent response includes players' IDs, so that we can display the portfolios at the front-end. The portfolios' data (summarized) is stored on the server.
  - The chart data is process from summarized data in run-time with javascript. This helps reduce storage but increase loading time. I should have pre-processed it but time didn't allow, as chart data must be formatted based on UI framework specification (so it's easier to transform data in Javascript) 
  
  - The ID display problem in the video is highly mitigated in the newest version. Please test the app for result.

 ## Data notes
 ### Valorant Tournaments Regions & Tiers
 #### 1. VCT International
  - These are tier 1 Valorant Tournaments. Tournaments are hosted directly by Riot Games. There are 4 main regions:
    + Pacific
    + CN
    + Americas
    + EMEA
  - Teams in these regions may compete in some international events.

 #### 2. VCT Challengers
  - These are tier 2 Valorant Tournaments. At the end of the day, there are 4 Ascension Tournaments associated with 4 main tier 1 regions. These tournaments are held to promote 4 tier 2 teams to tier 1. Each regions has many different VCT Challengers tournaments. The structure for these small tournaments evolved in the last few years. Some of these small tournaments don't have data recorded. In general, these are the **RECORDED** region hierachy for the AI deduction.
    + Pacific: SEA (include VN, TH, PH, SG and MY, HK and TW, ID), SA(South Asia), JP, KR
    + CN: (No recorded tournaments)
    + Americas: BR, LATAM, LAS, LAN, NA
  

 #### 3. VCT Game Changers
  - ~ Same as VCT Challengers

 ### Player stats
  - There are many aspects to consider when judging a player. Through provided data, these stats are recorded: KDA, ACS, Gun kills in regard to these categories: agents, maps, or general.
  - Justification:
    - Guns play an important strategic role in Valorant. Some strategies are:
      - Operator is the one shot sniper and is usually used to lock a site entrance. However, the Operator is the most expensive gun in the game. The stats are important to decide which player should be given the Operator and Sniper role.
      - Shotguns (Judge) are good in maps with corners, and with specific agents like Raze. The stats are important to decide which player can use shotguns, and to create a strategy around that gun.
      - Vandal and Phantom are the 2 strong & expensive ARs in the game with high damage. Players with good stats should use these guns to carry, while others buy utils abilities to support these main carries.
    - KDA is a good stat that shows a player's performance. The standard KDA can vary depend on the agent and the strategic role, but in general, a good KDA means a good player.
    - ACS(Average Combat Score): This stat has been proved to be one of the good stat to judge the player. More details can be found [here](https://tracker.gg/valorant/articles/what-is-acs-in-valorant-and-how-does-it-work).

    - Data are store in a file on S3. The agent has an action group that fetch data from S3 and return the information to the agent. Of course the agent has to format input before calling the Lambda function. Information the agent needs to provide include the current Leagues and Regions of players it want to choose to create the team, players' names and ids when it wants more information about the players.

  
  ### General game information
   - Information about agents and maps are scraped from the web and AI generated.
   - These information includes agents abilities, game roles, maps information.
   - These information are used to create the vector store and knowledge base. When creating teams, the agent will choose a team composition and strategies from its retrieved chunks.

  ### Some obstacles when processing data
   - Leagues and Regions are rename from abbreviations and "code-like" names to human-readable names.
   - Only information in 2024 are used. That's enough for the agent to process.
   - Gamephase=="GAME_ENDED" event is used to get players' KDA, combat score, agents.
   - playerDied events are use to get gun kills and damage.
   - Event with 'snapshot' key is used to get agents, maps.
   - Some team has repeated records (FPX used to play in EMEA, now CN), we only keep the one with latest date.
   - Some players move Leagues/Teams. We keep the latest Leagues/Teams.
   - I was just using t2.micro for cost reduction but it just lags so I used t3.medium. 

 ## Testing instructions
  - Clone the project
  - To test locally: 
   cd client -> npm install -> create .env.local file to store AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY -> npm run dev (or npm run build -> npm start)
  - Or you can try the deployed version on [https://vct-esports-manager.mtd-dev.com/](https://vct-esports-manager.mtd-dev.com/). This website might be slower / not available sometime due to poor hardware settings (I'm poor :() But it should work most of the time.

