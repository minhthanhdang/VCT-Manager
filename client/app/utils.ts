import { profile } from "console";

export function findSubstringById(text: string) {
  // Loop through the string from the end
  for (let i = text.length - 1; i >= 0; i--) {
    // Check if the current character is a dot
    if (text[i] === '.') {
        // Get the substring from the dot to the end
        const substring = text.substring(i);
        
        // Check if "ID" is present in the substring
        if (substring.includes("ID")) {
            return {
                beforeSubstring: text.substring(0, i).trim(),
                afterSubstring: substring.trim(),
            };
        }
    }
  }
  return { beforeSubstring: text.trim(), afterSubstring: null }; // No dot followed by "ID" found
}

export function getBestAgents(records: any) {
  let temp: any = {};
  for (let i = 0; i < records.length; i++) {
    let record = records[i];
    if (!record.agents || !record.agents.agent_name) {
      continue
    }
    let agent = record.agents.agent_name;
    if (!temp.hasOwnProperty(agent)) {
      temp[agent] = { agent: agent, acs: 0, round_played: 0 };
    }
    temp[agent].acs += record.kda.combatScore/record.round_count;
    temp[agent].round_played += record.round_count;
  }

  for (let key in temp) {
    temp[key].acs = parseFloat((temp[key].acs/temp[key].round_played).toFixed(2));
  }

  temp = Object.values(temp).sort((a: any, b: any) => b.acs - a.acs);
  temp = temp.slice(0, 5);

  return temp.map((item: any) => item.agent);
}

export function getBestMaps(records: any) {
  let temp: any = {};
  for (let i = 0; i < records.length; i++) {
    let record = records[i];
    if (!record.map) {
      continue
    }
    let map = record.map;
    if (!temp.hasOwnProperty(map)) {
      temp[map] = { map: map, acs: 0, round_played: 0 };
    }
    temp[map].acs += record.kda.combatScore/record.round_count;
    temp[map].round_played += record.round_count;
  }

  for (let key in temp) {
    temp[key].acs = parseFloat((temp[key].acs/temp[key].round_played).toFixed(2));
  }

  temp = Object.values(temp).sort((a: any, b: any) => b.acs - a.acs);
  temp = temp.slice(0, 5);

  return temp.map((item: any) => item.map);
}

export function getAgentCount(records: any) {
  let temp: any = {};
  for (let i = 0; i < records.length; i++) {
    let record = records[i];
    if (!record.agents || !record.agents.agent_name) {
      continue
    }
    let agent = record.agents.agent_name;
    if (!temp.hasOwnProperty(agent)) {
      temp[agent] = 0;
    }
    temp[agent]++;
  }

  temp = Object.entries(temp).map(([key, value]) => ({ agent: key, played: value }));
  temp = temp.sort((a: any, b: any) => b.played - a.played);

  temp = temp.slice(0, 5);
  if (temp.length > 5) {
    let other = temp.slice(5).reduce((acc: number, curr: any) => acc + curr.played, 0);
    temp.push({ agent: "Other", played: other });
  }

  return temp;
}

export function getAgentsLineChartData(records: any) {
  let temp: any = {};
  for (let i = 0; i < records.length; i++) {
    let record = records[i];
    if (!record.agents || !record.agents.agent_name) {
      continue
    }
    let agent = record.agents.agent_name;
    if (!temp.hasOwnProperty(agent)) {
      temp[agent] = [] ;
    }
    temp[agent].push(parseFloat((record.kda.combatScore/record.round_count).toFixed(2)));
  }

  temp = Object.entries(temp).map(([key, value]) => ({ 
    agent: key, 
    acs: value 
  }));

  temp = temp.sort((a: any, b: any) => {b.acs.length - a.acs.length});

  if (temp.length > 6) {
    temp = temp.slice(0, 6);
  }

  let result: any[] = []
  for (let i = 5; i >= 0; i--) {
    

    let tempObj: any = { dataPoint: i}
    for (let j = 0; j < temp.length; j++) {
      if (temp[j].acs.length < i + 1) {
        tempObj[temp[j].agent] = null;
      } else {
        tempObj[temp[j].agent] = temp[j].acs[i]
      }
    }
    
    result.push(tempObj);
  }

  result = result.reverse();

  return result;
}

export function getAgentsKDRatio(records: any) {
  let temp: any = {};
  for (let i = 0; i < records.length; i++) {
    let record = records[i];
    if (!record.agents || !record.agents.agent_name) {
      continue
    }
    let agent = record.agents.agent_name;
    if (!temp.hasOwnProperty(agent)) {
      temp[agent] = { agent: agent, kills: 0, deaths: 0 };
    }
    temp[agent].kills += record.kda.kills;
    temp[agent].deaths += record.kda.deaths;
  }

  let result: any[] = []
  for (let key in temp) {
    let kdratio = parseFloat((temp[key].kills/temp[key].deaths).toFixed(2));

    result.push({ agent: key, kdr: kdratio });
  }

  result = result.sort((a: any, b: any) => b.kdr - a.kdr);
  if (result.length > 5) {
    result = result.slice(0, 5);
  }
  return result;
}

export function getMapsLineChartData(records: any) {
  let temp: any = {};
  for (let i = 0; i < records.length; i++) {
    let record = records[i];
    if (!record.map) {
      continue
    }
    let map = record.map;
    if (!temp.hasOwnProperty(map)) {
      temp[map] = [] ;
    }
    temp[map].push(parseFloat((record.kda.combatScore/record.round_count).toFixed(2)));
  }

  temp = Object.entries(temp).map(([key, value]) => ({ 
    map: key, 
    acs: value 
  }));

  temp = temp.sort((a: any, b: any) => {b.acs.length - a.acs.length});

  if (temp.length > 6) {
    temp = temp.slice(0, 6);
  }

  let result: any[] = []
  for (let i = 5; i >= 0; i--) {
    

    let tempObj: any = { dataPoint: i}
    for (let j = 0; j < temp.length; j++) {
      if (temp[j].acs.length < i + 1) {
        tempObj[temp[j].map] = null;
      } else {
        tempObj[temp[j].map] = temp[j].acs[i]
      }
    }
    
    result.push(tempObj);
  }

  result = result.reverse();

  return result;
}

export function getMapsKDRatio(records: any) {
  let temp: any = {};
  for (let i = 0; i < records.length; i++) {
    let record = records[i];
    if (!record.map) {
      continue
    }
    let map = record.map;
    if (!temp.hasOwnProperty(map)) {
      temp[map] = { map: map, kills: 0, deaths: 0 };
    }
    temp[map].kills += record.kda.kills;
    temp[map].deaths += record.kda.deaths;
  }

  let result: any[] = []
  for (let key in temp) {
    let kdratio = parseFloat((temp[key].kills/temp[key].deaths).toFixed(2));

    result.push({ map: key, kdr: kdratio });
  }

  result = result.sort((a: any, b: any) => b.kdr - a.kdr);
  if (result.length > 5) {
    result = result.slice(0, 5);
  }
  return result;
}

export function getSuggestMapAgents(profiles: any[]) {
  try {

  let best_agents = {
    "Abyss": [
      ["Sova", "KAY/O", "Gekko"],
      ["Cypher", "Deadlock"],
      ["Omen", "Astra", "Viper"],
      ["Jett", "Yoru"]
    ],
    "Ascent": [
      ["Fade", "Sova", "KAY/O"],
      ["Cypher", "Killjoy", "Sage"],
      ["Astra", "Brimstone", "Omen"],
      ["Jett", "Reyna", "Neon"],
    ],
    "Bind": [
      ["Skye", "Fade", "Gekko"],
      ["Sage", "Cypher", "Killjoy"],
      ["Viper", "Brimstone", "Harbor"],
      ["Raze", "Jett", "Yoru"],
    ],
    "Haven": [
      ["Breach", "Sova", "KAY/O"],
      ["Killjoy", "Cypher", "Chamber"],
      ["Omen", "Astra", "Clove"],
      ["Jett", "Neon", "Phoenix"]
    ],
    "Pearl": [
      ["Fade", "KAY/O", "Sova"],
      ["Cypher", "Killjoy", "Chamber"],
      ["Astra", "Omen"],
      ["Neon", "Jett", "Yoru"]
    ],
    "Split": [
      ["KAY/O", "Breach", "Skye"],
      ["Cypher", "Deadlock", "Chamber"],
      ["Viper", "Omen", "Clove"],
      ["Raze", "Jett"]
    ],
    "Sunset": [
      ["Sova", "Breach", "Fade"],
      ["Cypher"],
      ["Omen", "Clove"],
      ["Neon", "Raze", "Yoru"]
    ]
  }

  // Get list of 5 agent stats for 5 profiles
  const agent_stats = profiles.map((profile) => profile["agent_statistics"])
  let result: any = {}

  // Get list of 5 agent pools of 5 players
  let agent_pools: any[] = []
  for (const agent_stat of agent_stats) {
    agent_pools.push(agent_stat.map((stat: any) => stat["agent"]))
  }
  
  // Loop through the maps
  for (let [map, role_agents] of Object.entries(best_agents)) {
    let temp: any[] = [];
    role_agents = role_agents.reverse();

    role_agents.push(role_agents.flat());

    // Loop through each position
    for (let i = 0; i < role_agents.length; i++) {
      let agent_pool = agent_pools[i];
      let found = false;
      for (const agent of agent_pool) {
        if (role_agents[i].includes(agent) && !temp.includes(agent)) {
          temp.push(agent)
          found = true
          break
        }
      }
      if (!found) {
        for (const agent of agent_pool) {
          if (!temp.includes(agent)) {
            temp.push(agent)
            found = true
            break
          }
        }
      }
      if (!found) {
        for (const agent of role_agents[i]) {
          if (!temp.includes(agent)) {
            temp.push(agent)
            found = true
            break
          }
        }
      }
    }

    result[map] = temp;
  }
  return result;
  }
  catch (error) {
    return {}
  }
}

export function getMostPlayedMaps(records: any[]) {
  let temp: any = {};
  for (let i = 0; i < records.length; i++) {
    let record = records[i];
    if (!record.map) {
      continue
    }
    let map = record.map;
    if (!temp.hasOwnProperty(map)) {
      temp[map] = 0;
    }
    temp[map]++;
  }

  temp = Object.entries(temp).map(([key, value]) => ({ map: key, played: value }));
  temp = temp.sort((a: any, b: any) => b.played - a.played);

  temp = temp.slice(0, 5);
  if (temp.length > 5) {
    let other = temp.slice(5).reduce((acc: number, curr: any) => acc + curr.played, 0);
    temp.push({ map: "Other", played: other });
  }

  return temp;
}