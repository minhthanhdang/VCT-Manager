import json
import boto3
import random
import xml.etree.ElementTree as ET

def lambda_handler(event, context):

  # connect to S3, specify the buckets
  s3 = boto3.client('s3')
  BUCKET_NAME = 'mtd-vct-players-metadata'
  STATIC_BUCKET_NAME = 'mtd-vct-ground-knowledge'



  def get_request_body_parameter(event, name):
    print("Event:",  event)

    # Get request body json
    requestBody = event['requestBody']['content']['application/json']['properties']
    requirements_value = ""
    for prop in requestBody:
      if prop['name'] == name:
        requirements_value = prop['value']
        break

    if requirements_value in ["create_team", "createTeam"]:
      return "create_team"
    if requirements_value in ["justify_player", "justifyPlayer"]:
      return "justify_player"
    if requirements_value in ["replace_player", "replacePlayer"]:
      return "replace_player"
    if requirements_value in ["offense_scenario", "offenseScenario"]:
      return "offense_scenario"


    # Try if the body is JSON or YAML
    try:
      requirements = json.loads(requirements_value)
    except Exception as err: 
      print(err)
      return "Try specifying the requirements in JSON format."

    print("These are the requirements specified: ", requirements)
    return requirements
  
  def _is_team_eligible(duelists, controllers, sentinels, initiators, flexs):
    all_initiators = ["Breach", "Fade", "Gekko", "KAY/O", "Skye", "Sova"]
    all_controllers = ["Astra", "Brimstone", "Clove", "Harbor", "Omen", "Viper"]
    all_sentinels = ["Chamber", "Cypher", "Deadlock", "Killjoy", "Sage", "Vyse"]
    all_duelists = ["Iso", "Jett", "Neon", "Phoenix", "Raze", "Reyna", "Yoru"]
    
    initiators = [i for i in initiators if i in all_initiators]
    controllers = [c for c in controllers if c in all_controllers]
    sentinels = [s for s in sentinels if s in all_sentinels]
    duelists = [d for d in duelists if d in all_duelists]

    best_agents = {
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

    map_covered = 0

    for map in best_agents.keys():
      pref = best_agents.get(map)
      found = False
      for d in duelists:
        for c in controllers:
          for s in sentinels:
            for i in initiators:
              for f in flexs:
                if len(set([d, c, s, i, f])) != 5:
                  continue
                if d in pref[3] and c in pref[2] and s in pref[1] and i in pref[0] and f in [item for sublist in pref for item in sublist]:
                  print("Found eligible team", d, c, s, i, f, "for map", map)
                  map_covered += 1
                  found = True
                  break
              if found:
                break
            if found:
              break
          if found:
            break
        if found:
          break
                
    if map_covered >= 5:
      return True
    return False
  
  def _get_profiles(league, region, role, count=5):

    try:
      print("Loading profiles", league, region)
      # Try get data from S3, from chosen league
      response = s3.get_object(Bucket=BUCKET_NAME, Key=f'profiles-v2/{league}/profiles.json')
      print("Received response from S3 for profiles in", league, region)
      file_content = json.loads(response['Body'].read().decode('utf-8'))
      print("Loaded json", file_content)
      profiles = file_content['players_sort_by_better_acs_first']
      
      eligible_profiles = []

      print("Loaded profiles")
      print("current roles: ", role)

      # Get profiles with eligible regions
      if not region:
        eligible_profiles = profiles
      elif region.lower() == 'apac':
        eligible_profiles = [profile for profile in profiles if profile['region'].lower() in ['apac', 'pacific', 'kr', 'jpn', 'jp', 'sea', 'vn', 'sa', 'id', 'th', 'hktw', 'sgmy', 'ph']]
      elif region.lower() == 'pacific':
        eligible_profiles = [profile for profile in profiles if profile['region'].lower() in ['pacific', 'apac', 'kr', 'jpn', 'jp', 'sea', 'vn', 'sa', 'id', 'th', 'hktw', 'sgmy', 'ph', 'ea']]
      elif region.lower() == 'emea':
        eligible_profiles = [profile for profile in profiles if profile['region'].lower() in ['emea', 'italy', 'portugal']]
      elif region.lower() == 'latam':
        eligible_profiles = [profile for profile in profiles if profile['region'].lower() in ['latam', 'lan', 'las']]
      elif region.lower() == 'americas':
        eligible_profiles = [profile for profile in profiles if profile['region'].lower() in ['americas', 'na', 'br', 'latam', 'lan', 'las']]
      elif region.lower() == 'sea':
        eligible_profiles = [profile for profile in profiles if profile['region'].lower() in ['sea', 'vn', 'th', 'hktw', 'id', 'ph', 'sgmy']]
      elif region.lower() == 'cn' or region.lower() == 'china':
        eligible_profiles = [profile for profile in profiles if profile['region'].lower() in ['cn', 'china']]
      elif region.lower() == 'ea':
        eligible_profiles = [profile for profile in profiles if profile['region'].lower() in ['kr', 'jp', 'ea']]
      elif region.lower() == 'na':
        eligible_profiles = [profile for profile in profiles if profile['region'].lower() in ['na']]
      elif region.lower() == 'kr':
        eligible_profiles = [profile for profile in profiles if profile['region'].lower() in ['kr']]
      elif region.lower() == 'jp':
        eligible_profiles = [profile for profile in profiles if profile['region'].lower() in ['jp']]
      elif region.lower() == 'sa':
        eligible_profiles = [profile for profile in profiles if profile['region'].lower() in ['sa']]
      elif region.lower() == 'br':
        eligible_profiles = [profile for profile in profiles if profile['region'].lower() in ['br']]
      elif region.lower() == 'vn':
        eligible_profiles = [profile for profile in profiles if profile['region'].lower() in ['vn']]
      elif region.lower() == 'id':
        eligible_profiles = [profile for profile in profiles if profile['region'].lower() in ['id']]
      elif region.lower() == 'th':
        eligible_profiles = [profile for profile in profiles if profile['region'].lower() in ['th']]
      elif region.lower() == 'ph':
        eligible_profiles = [profile for profile in profiles if profile['region'].lower() in ['ph']]
      elif region.lower() == 'sgmy':
        eligible_profiles = [profile for profile in profiles if profile['region'].lower() in ['sgmy']]
      elif region.lower() == 'hktw':
        eligible_profiles = [profile for profile in profiles if profile['region'].lower() in ['hktw']]
      elif region.lower() == 'portugal':
        eligible_profiles = [profile for profile in profiles if profile['region'].lower() in ['portugal']]
      elif region.lower() == 'las':
        eligible_profiles = [profile for profile in profiles if profile['region'].lower() in ['las']]
      elif region.lower() == 'lan':
        eligible_profiles = [profile for profile in profiles if profile['region'].lower() in ['lan']]
      elif region.lower() == 'italy':
        eligible_profiles = [profile for profile in profiles if profile['region'].lower() in ['italy']]
      
      else:
        eligible_profiles = profiles

      print("Eligible profiles: ", len(eligible_profiles))
      # Get ~5 profiles to judge
      result = []

      print(len(eligible_profiles))
      for profile in eligible_profiles:
        if profile['region']!= "" and profile['region']!= None and role in profile['roles']:
          result.append(profile)
          if len(result) >= count:
            break

      print("Player flound: ", len(result))
      
      return result

    except Exception as err:
      print(err)
      return []
  
  def _shorten_profile(profile, role):
    all_agents = {
      "Duelist": ["Iso", "Jett", "Neon", "Phoenix", "Raze", "Reyna", "Yoru"],
      "Controller": ["Astra", "Brimstone", "Clove", "Harbor", "Omen", "Viper"],
      "Sentinel": ["Chamber", "Cypher", "Deadlock", "Killjoy", "Sage", "Vyse"],
      "Initiator": ["Breach", "Fade", "Gekko", "KAY/O", "Skye", "Sova"],
      "Flex": ["Astra", "Brimstone", "Clove", "Harbor", "Omen", "Viper", "Chamber", "Cypher", "Deadlock", "Killjoy", "Sage", "Vyse", "Breach", "Fade", "Gekko", "KAY/O", "Skye", "Sova", "Iso", "Jett", "Neon", "Phoenix", "Raze", "Reyna", "Yoru"]
    }
    short_profile = {}
    short_profile["id"] = profile["id"]
    short_profile["first_name"] = profile["first_name"]
    short_profile["last_name"] = profile["last_name"]
    short_profile["in_game_name"] = profile["in_game_name"]
    short_profile["current_team_acronym"] = profile["current_team_acronym"]
    short_profile["current_team_name"] = profile["current_team_name"]
    short_profile["current_league_name"] = profile["current_league_name"]
    short_profile["region"] = profile["region"]
    if profile["general_statistics"]["deaths"] == 0:
      profile["general_statistics"]["deaths"] = 1
    short_profile["general_statistics"] = {
      "acs": profile["general_statistics"]["acs"],
      "kill_death_ratio": round(profile["general_statistics"]["kills"]/profile["general_statistics"]["deaths"], 2),
      "assists_per_round": profile["general_statistics"]["assists"]
    }
    short_profile["offense_statistics"] = profile["offense_statistics"]
    short_profile["defense_statistics"] = profile["defense_statistics"]
    short_profile["agent_statistics"] = [{
      "agent": agent["agent"],
      "acs": agent["acs"],
      "kill_death_ratio": round(agent["kills"]/max(agent["deaths"],1), 2),
      "assists_per_round": agent["assists"],
      "game_played": agent["game_count"]
    } for agent in profile["agent_statistics"]]
    short_profile["agent_statistics"] = sorted(short_profile["agent_statistics"], key=lambda x: (x["agent"] not in all_agents[role],))
    short_profile["map_statistics"] = [{
      "map": map["map"],
      "acs": map["acs"],
      "kill_death_ratio": round(map["kills"]/max(map["deaths"],1), 2),
      "assists_per_round": map["assists"],
      "game_played": map["game_count"]
    } for map in profile["map_statistics"]]

    return short_profile

  def _find_detailed_profile(playerInfos):
    result = []
    try:
      ### LOAD THE DATA ###
      game_changers_metadata = s3.get_object(Bucket=BUCKET_NAME, Key=f'profiles-v2/game-changers/modified_profiles.json')
      vct_international_metadata = s3.get_object(Bucket=BUCKET_NAME, Key=f'profiles-v2/vct-international/modified_profiles.json')
      vct_challengers_metadata = s3.get_object(Bucket=BUCKET_NAME, Key=f'profiles-v2/vct-challengers/modified_profiles.json')
      game_changers_content = json.loads(game_changers_metadata['Body'].read().decode('utf-8'))
      vct_international_content = json.loads(vct_international_metadata['Body'].read().decode('utf-8'))
      vct_challengers_content = json.loads(vct_challengers_metadata['Body'].read().decode('utf-8'))

      game_changers_profiles = game_changers_content['players_sort_by_better_acs_first']
      vct_international_profiles = vct_international_content['players_sort_by_better_acs_first']
      vct_challengers_profiles = vct_challengers_content['players_sort_by_better_acs_first']

      for playerInfo in playerInfos:
        playerId = ''
        playerFirstName = ''
        playerLastName = ''
        if "id" in playerInfo.keys():
          print("Looking for player with id:", playerInfo['id'])
          playerId = playerInfo['id']
        if "first_name" in playerInfo.keys() and playerInfo['first_name'] != None and playerInfo['first_name'] != "" and type(playerInfo['first_name']) == str:
          playerFirstName = playerInfo['first_name'].lower()
        if "last_name" in playerInfo.keys() and playerInfo['last_name'] != None and playerInfo['last_name'] != "" and type(playerInfo['last_name']) == str:
          playerLastName = playerInfo['last_name'].lower()
        
        found = False
        for profile in game_changers_profiles:
          if profile['id'] == playerId:
            result.append(profile)
            found = True
            break
          elif playerFirstName != "" and playerFirstName.strip() == profile['first_name'].lower().strip() and playerLastName.strip() == profile['last_name'].lower().strip():
            result.append(profile)
            found = True
            break
        if found:
          continue
        for profile in vct_international_profiles:
          if profile['id'] == playerId:
            result.append(profile)
            found = True
            break
          elif playerFirstName != "" and playerFirstName.strip() == profile['first_name'].lower().strip() and playerLastName.strip() == profile['last_name'].lower().strip():
            result.append(profile)
            found = True
            break
        if found:
          continue
        for profile in vct_challengers_profiles:
          if profile['id'] == playerId:
            result.append(profile)
            found = True
            break
          elif playerFirstName != "" and playerFirstName.strip() == profile['first_name'].lower().strip() and playerLastName.strip() == profile['last_name'].lower().strip():
            result.append(profile)
            found = True
            break
              
      print("Player detail found: ", len(result))
      return result
    except Exception as err:
      print(err)
      return []

  def getSuggestedTeam(event):

    # Get the leagues and regions requirements
    requirements = get_request_body_parameter(event, 'requirements')
    print("Number of requirements received: ", len(requirements))

    # Check for valid JSON
    if type(requirements) == str:
      return requirements

    
    profile_groups = []
    total_profiles = 0

    
    requirement_count = len(requirements)
    no_requirement_count = 5 - requirement_count
    
    # A team must have 5 roles filled
    roles_to_fill = ["Duelist", "Controller", "Sentinel", "Initiator", "Flex"]

    # Loop through 5 requirements (or less), append eligible profiles to profile_groups
    for requirement in requirements:
      league = requirement.get('league', ['vct-challengers', 'vct-international', 'game-changers'])
      region = requirement.get('region', 'any')
      
      
      # check if league is international then region must in ['pacific', 'americas', 'china', 'emea']
      valid = True
      if league == 'vct-international':
        valid = False

        if type(region) == list:
          for r in region:
            if r in ['apac', 'pacific', 'americas', 'china', 'cn', 'emea']:
              valid = True
              break
        
        if type(region) == str:
          if region.lower() in ['apac', 'pacific', 'americas', 'china', 'cn', 'emea'] or region.lower() == 'any':
            valid = True

        if not valid:
          return "Invalid region specified for VCT International. VCT International only has 4 regions: pacific, americas, china, emea"
        
      # Turn league and region into lists. The AI is unpredictable, sometimes it input a list, sometimes it uses a string. We check both scenario
      if type(region) == str:
        region = [region]
      if type(league) == str:
        league = [league]

      # If there are more than 1 choice available, choose randomly
      random.shuffle(league)
      random.shuffle(region)
      role = roles_to_fill.pop()

      print("this is the league: ", league)
      print("this is the region: ", region)

      # Loop through each league and region combination until find a profile group
      found = False
      for l in league:
        for r in region:
          profiles = _get_profiles(l, r, role)
          if len(profiles) > 0:
            profile_groups.append({
              'league': l,
              'region': r,
              'role': role,
              'profiles': profiles
            })
            total_profiles += len(profiles)
            found = True
            break
        if found:
          break

      if not found:
        for l in league:
          for r in region:
            profiles = _get_profiles(l, r, "Initiator", 10)
            if len(profiles) > 0:
              profile_groups.append({
                'league': l,
                'region': r,
                'role': role,
                'profiles': profiles
              })
              total_profiles += len(profiles)
              found = True
              break
          if found:
            break

    # If the AI agent only specify < 5 position requirements, add a random profile group to it
    if no_requirement_count > 0:
      for i in range(no_requirement_count):
        if len(role) <=0 :
          break
        role = roles_to_fill.pop()
        leauges = ['vct-challengers', 'vct-international', 'game-changers']
        random_league = random.choice(leauges)
        profiles = _get_profiles(random_league, 'any', 4)
        print("Profiles: ", profiles)
        total_profiles += len(profiles)
        profile_groups.append({
          'league': random_league,
          'region': 'any',
          'role': role,
          'profiles': profiles
        })

    print(len(profile_groups))
    print([item['role'] for item in profile_groups])  
    if total_profiles < 5:
      return "Not enough profiles found"
    if len(profile_groups) < 5:
      return "Not enough profile groups found"
    
    return_profiles = []

    profile_groups = profile_groups[::-1]
    
    found = False
    skip = random.choice([0, 1, 2, 3])
    for d_p in profile_groups[0]["profiles"]:
      for c_p in profile_groups[1]["profiles"]:
        for s_p in profile_groups[2]["profiles"]:
          for i_p in profile_groups[3]["profiles"]:
            for f_p in profile_groups[4]["profiles"]:
              if len(set([d_p["id"], c_p["id"], s_p["id"], i_p["id"], f_p["id"]])) != 5:
                continue
              eligible = _is_team_eligible(
                [item["agent"] for item in d_p["agent_statistics"]],
                [item["agent"] for item in c_p["agent_statistics"]],
                [item["agent"] for item in s_p["agent_statistics"]],
                [item["agent"] for item in i_p["agent_statistics"]],
                [item["agent"] for item in f_p["agent_statistics"]]
              )
              if eligible:
                if skip > 0:
                  skip -= 1
                  continue
                else:
                  print("Found eligible team")
                  found = True
                  return_profiles = [d_p, c_p, s_p, i_p, f_p]
                  break
            if found:
              break
          if found:
            break
        if found:
          break
      if found:
        break
      
    print("Couldn't find eligible team")
    return_results = [
      {
        "role": "Duelist",
        "profiles": _shorten_profile(return_profiles[0], "Duelist")
      },
      {
        "role": "Controller",
        "profiles": _shorten_profile(return_profiles[1], "Controller")
      },
      {
        "role": "Sentinel",
        "profiles": _shorten_profile(return_profiles[2], "Sentinel")
      },
      {
        "role": "Initiator",
        "profiles": _shorten_profile(return_profiles[3], "Initiator")
      },
      {
        "role": "Flex",
        "profiles": _shorten_profile(return_profiles[4], "Flex")
      }
    ]
    print("Return profiles: ", return_results)
      
    return {"profiles": return_results}
    
  def getPlayersDetailProfile(event):
    requestBody = event['requestBody']['content']['application/json']['properties']

    print("Event: ", event)
    playerInfos = []
    for prop in requestBody:
      if prop['name'] == 'playersInfo':
        playerInfosStr = prop['value']
        break

    result = []

    try:
      playerInfos = json.loads(playerInfosStr)

    except: 
      try: 
        text = "<root>" + playerInfosStr + "</root>"
        root = ET.fromstring(text)

        # Iterate through each item and convert to dictionary
        for item in root.findall('item'):
          id = item.find('id').text if item.find('id') is not None else ""
          first_name = item.find('first_name').text if item.find('first_name') is not None else ""
          last_name = item.find('last_name').text if item.find('last_name') is not None else ""

          if id != "" and first_name == "" and last_name == "":
            playerInfos.append({'id': id, 'first_name': first_name, 'last_name': last_name})
          print("Player info in XML: ", playerInfos)

        if len(playerInfos) == 0:
          for player in root.findall('player'):
            id = player.find('id').text if player.find('id') is not None else ""
            first_name = player.find('firstName').text if player.find('firstName') is not None else ""
            last_name = player.find('lastName').text if player.find('lastName') is not None else ""

            if id != "" or (first_name == "" and last_name == ""):
              playerInfos.append({'id': id, 'first_name': first_name, 'last_name': last_name})
            playerInfos.append({
                'id': id,
                'first_name': first_name,
                'last_name': last_name
            })
      except Exception as err:
        print(err)
        return []
      
    try:
      ### LOAD THE DATA ###
      game_changers_metadata = s3.get_object(Bucket=BUCKET_NAME, Key=f'profiles-v2/game-changers/modified_profiles.json')
      vct_international_metadata = s3.get_object(Bucket=BUCKET_NAME, Key=f'profiles-v2/vct-international/modified_profiles.json')
      vct_challengers_metadata = s3.get_object(Bucket=BUCKET_NAME, Key=f'profiles-v2/vct-challengers/modified_profiles.json')
      game_changers_content = json.loads(game_changers_metadata['Body'].read().decode('utf-8'))
      vct_international_content = json.loads(vct_international_metadata['Body'].read().decode('utf-8'))
      vct_challengers_content = json.loads(vct_challengers_metadata['Body'].read().decode('utf-8'))

      game_changers_profiles = game_changers_content['players_sort_by_better_acs_first']
      vct_international_profiles = vct_international_content['players_sort_by_better_acs_first']
      vct_challengers_profiles = vct_challengers_content['players_sort_by_better_acs_first']

      for playerInfo in playerInfos:
        playerId = ''
        playerFirstName = ''
        playerLastName = ''
        if type(playerInfo) == str:
          playerId = playerInfo
        else:
          if "id" in playerInfo.keys():
            playerId = playerInfo['id']
          if "first_name" in playerInfo.keys() and playerInfo['first_name']:
            playerFirstName = playerInfo['first_name'].lower()
          if "last_name" in playerInfo.keys() and playerInfo['last_name']:
            playerLastName = playerInfo['last_name'].lower()
        
        found = False
        for profile in game_changers_profiles:
          if profile['id'] == playerId:
            result.append(profile)
            found = True
            break
          elif playerFirstName.strip() == profile['first_name'].lower().strip() and playerLastName.strip() == profile['last_name'].lower().strip():
            result.append(profile)
            found = True
            break
        if found:
          continue
        for profile in vct_international_profiles:
          if profile['id'] == playerId:
            result.append(profile)
            found = True
            break
          elif playerFirstName.strip() == profile['first_name'].lower().strip() and playerLastName.strip() == profile['last_name'].lower().strip():
            result.append(profile)
            found = True
            break
        if found:
          continue
        for profile in vct_challengers_profiles:
          if profile['id'] == playerId:
            result.append(profile)
            found = True
            break
          elif playerFirstName.strip() == profile['first_name'].lower().strip() and playerLastName.strip() == profile['last_name'].lower().strip():
            result.append(profile)
            found = True
            break
              
      return {"playerInfos": result}

    except:
      return {"playerInfos": []}

  def getGuideline(event):
    guideline = ""

    task = get_request_body_parameter(event, 'action')
    print("TASK: ", task)
    if task == "create_team" or task == "createTeam":
      print("Create team guideline")
      guideline = """
        Creating Team Guidelines:

        Here are the available regions for each league:
        1. vct-international: americas, pacific, cn, emea
        2. vct-challengers: id, vn, sgmy, br, latam, na, italy, lan, ph, sa, portugal, hktw, jp, las, th, pacific, kr
        3. game-changers: kr, sa, jp, br, latam, na, emea, pacific, ea, sea.
        You MUST check the user request first. If the player doesn't specify the region or league, you MUST choose the requirements randomly by yourself, then proceed to getSuggestedTeam. If the user is requesting an unavailable region in a specific league, inform the user and ask the user to change the request.
        If the user request pro player, only take players from vct-international. If the user request semi-pro players, only take players from vct-challengers and game-changers. If the user request mix-gender players, only take players from game-changers.
        When creating a Valorant team, you have to introduce every players and their statistics. These are the general statistics that you will see:
        1. Role: The role that a player is most suitable for in this team composition. There are five roles: Duelist, Controller, Sentinel, Initiator, and Flex.
        2. Average Combat Score (ACS): This is the number indicating how well a player performing in general. This number varies depends on the role of the player.
        3. K/D ratio: This is the number indicating how well the player aim in game. Having a higher K/D ratio than 1.0 generally means that the player kills more than dies, which is always good in a FPS shooting game.
        4. Assists per round: Generally, a number of more than 0.25 assists per round means this player has good team coordination. For every other roles except Duelist, a number of more than 0.4 shows that the player excels at supporting teammates.
        5. Agent statistics: Statistics per agent. Generally, you only look at the agents included in the player's role. Below is the list of all roles and agents in that role:
            - Duelist: Jett, Phoenix, Reyna, Raze, Yoru, Neon, Iso.
            - Controller: Brimstone, Viper, Omen, Astra, Harbor, Clove.
            - Sentinel: Cypher, Killjoy, Sage, Chamber, Deadlock, Vyse.
            - Initiator: Breach, Sova, Skye, KAY/O, Fade, Gekko.
            - Flex: every agents can be played in Flex role.
        The more agents in the role the player can play, the more flexible the player is. If the game count of an agent exceeds 20, it proves that the player plays that agent so well.
        6. Map statistics: Statistics per map. The current 7 maps in rotation are: Abyss, Bind, Haven, Pearl, Split, Sunset. The more maps in these 7 maps the player has played, the better the player will be in this current rotation. More than 8 maps mean the player is very experienced.
        7. Offense and defense statistics. In a Valorant round, 1 team plays offense, 1 team plays defense, and the 2 teams swap sides oftenly. A kill death ratio > 1.0 on offense means the player is good at attacking. A first kill rate > 0.15 on offense means the player is good at entering site, causing confusion, gathering information, and trading kills. A kill death ratio > 1.0 on defense means the player is good at defending. An average damage > 175 means the player is good overall.
      """

    if task == "replace_player" or task == "replacePlayer":
      guideline = """
        Replace player guideline:

        When being asked to replace a player, you need to look at the current team. Identify which player the user want to replace. If that player wasn't on the team, ask the user for clarification. Else, extract information about that player's ID, first name, last name; and about the desired new region, league; and then get the replacement of that player. Also specify the IDs of the player on the current team. Then get the replacement player. You must format your request in JSON. In your response, you must introduce the new player statistics, and justify why you made that choice (normally because both players share the same league, region, role, and agent pool). Then make sure to include the new team players' IDs at the end.
      """
    return {"guideline": guideline}

  def getReplacement(event):
    # List of agents in roles
    all_agents = {
      "Duelist": ["Iso", "Jett", "Neon", "Phoenix", "Raze", "Reyna", "Yoru"],
      "Controller": ["Astra", "Brimstone", "Clove", "Harbor", "Omen", "Viper"],
      "Sentinel": ["Chamber", "Cypher", "Deadlock", "Killjoy", "Sage", "Vyse"],
      "Initiator": ["Breach", "Fade", "Gekko", "KAY/O", "Skye", "Sova"],
      "Flex": ["Astra", "Brimstone", "Clove", "Harbor", "Omen", "Viper", "Chamber", "Cypher", "Deadlock", "Killjoy", "Sage", "Vyse", "Breach", "Fade", "Gekko", "KAY/O", "Skye", "Sova", "Iso", "Jett", "Neon", "Phoenix", "Raze", "Reyna", "Yoru"]
    }
    unavailable = get_request_body_parameter(event, 'toReplace')
    current_team = get_request_body_parameter(event, 'unavailablePlayers')

    print("Need to replace", unavailable)
    print("Current team:", current_team)
    if type(unavailable) == str:
      return "Wrong input format for the player that needs to be replaced"
    id = unavailable.get('id', '')
    role = unavailable.get('role', '')
    first_name = unavailable.get('first_name', '')
    last_name = unavailable.get('last_name', '')
    region = unavailable.get('region', '')
    league = unavailable.get('league', '')
    result = []
    if id != None and id != '':
      result = _find_detailed_profile([{"id": id}])
      
    if len(result)==0 and first_name != None and first_name != '' and last_name != None and last_name != '':
      result = _find_detailed_profile([{"first_name": first_name, "last_name": last_name}])

    if len(result)==0:
      return "No player found"
    
    print("Player need to replace", result)
    role_agents = []
    agents = [a["agent"] for a in result[0]["agent_statistics"]]
    if role != None and role != '':
      if role in all_agents.keys():
        role_agents = [a for a in agents if a in all_agents[role]]
    else:
      roles = result[0].get("roles", [])
      if len(roles) > 0:
        role = roles[0]
      else:
        role = "Initiator"
    if len(role_agents) == 0:
      role_agents = agents
    if region == '':
      region = result[0]["region"]
    if league == '':
      league = result[0]["current_league_name"]
    league_name = ""
    if league in ["vct-international", "vct-challengers", "game-changers"]:
      league_name = league
    elif league in ["VCT EMEA", "VCT Americas", "VCT China", "VCT Pacific"]:
      league_name = "vct-international"
    elif league in ["VCT Challengers SEA Indonesia", "VCT Challengers SEA Vietnam", "VCT Challengers Singaport and Malaysia", "VCT Challengers Brazil", "VCT Challengers Latin America", "VCT Challengers North America", "VCT Challengers Italy", "VCT Challengers Latin America North", "VCT Challengers SEA Philippines", "VCT Challengers South Asia", "VCT Challengers Portugal", "VCT Challengers SEA Hong Kong and Taiwan", "VCT Challengers Japan", "VCT Challengers Latin America South", "VCT Challengers SEA Thailand", "VCT Challengers Korea"]:
      league_name = "vct-challengers"
    elif league in ["Game Changers Korea", "Game Changers South Asia", "Game Changers Japan", "Game Changers Series Brazil", "Game Changers LATAM", "Game Changers North America", "Game Changers EMEA", "Game Changers Pacific", "Game Changers East Asia", "Game Changers SEA"]:
      league_name = "game-changers"

    if league_name == "":
      league_name = random.choice(["vct-international", "vct-challengers", "game-changers"])
    
    profiles = _get_profiles(league_name, region, role, 30)

    if type(current_team) == list:
      profiles = [p for p in profiles if p["id"] not in [c.get("id", "") for c in current_team]]
    else:
      profiles = [p for p in profiles if p["id"] != id]
    for p in profiles:
      agent_pool = [a["agent"] for a in p["agent_statistics"]]
      if len(set(role_agents) & set(agent_pool)) > 3:
        return p
    
    for p in profiles:
      agent_pool = [a["agent"] for a in p["agent_statistics"]]
      if len(set(role_agents) & set(agent_pool)) > 2:
        print("Found a suitable replacement", p)
        return p
      
    if len(profiles) > 0:
      p = random.choice(profiles)
      print("Randomly selected a replacement", p)
      return p
    else:
      return "Cannot find a suitable replacement"
    
  def getBestmap(event):
    print("Event: ", event)
    requestBody = event['requestBody']['content']['application/json']['properties']

    playerInfos = []
    playerInfosStr = ""
    for prop in requestBody:
      if prop['name'] == 'playersInfo':
        playerInfosStr = prop['value']
        break

    print("PlayerInfosStr: ", playerInfosStr)

    try:
      playerInfos = json.loads(playerInfosStr)

    except: 
      print("cannot load json")
      try: 
        text = "<root>" + playerInfosStr + "</root>"
        root = ET.fromstring(text)

        # Iterate through each item and convert to dictionary
        for item in root.findall('item'):
          id = item.find('id').text if item.find('id') is not None else ""
          first_name = item.find('first_name').text if item.find('first_name') is not None else ""
          last_name = item.find('last_name').text if item.find('last_name') is not None else ""

          playerInfos.append({'id': id, 'first_name': first_name, 'last_name': last_name})
      except Exception as err:
        print(err)
        return []
      
    try:
      print(playerInfos)
      ### LOAD THE DATA ###
      game_changers_metadata = s3.get_object(Bucket=BUCKET_NAME, Key=f'profiles-v2/game-changers/modified_profiles.json')
      vct_international_metadata = s3.get_object(Bucket=BUCKET_NAME, Key=f'profiles-v2/vct-international/modified_profiles.json')
      vct_challengers_metadata = s3.get_object(Bucket=BUCKET_NAME, Key=f'profiles-v2/vct-challengers/modified_profiles.json')
      game_changers_content = json.loads(game_changers_metadata['Body'].read().decode('utf-8'))
      vct_international_content = json.loads(vct_international_metadata['Body'].read().decode('utf-8'))
      vct_challengers_content = json.loads(vct_challengers_metadata['Body'].read().decode('utf-8'))

      game_changers_profiles = game_changers_content['players_sort_by_better_acs_first']
      vct_international_profiles = vct_international_content['players_sort_by_better_acs_first']
      vct_challengers_profiles = vct_challengers_content['players_sort_by_better_acs_first']

      result = []
      for playerInfo in playerInfos:
        playerId = ''
        playerFirstName = ''
        playerLastName = ''
        if type(playerInfo) == str:
          playerId = playerInfo
        elif type(playerInfo) == dict:
          if "id" in playerInfo.keys():
            playerId = playerInfo['id']
          if "first_name" in playerInfo.keys() and playerInfo['first_name']:
            playerFirstName = playerInfo['first_name'].lower()
          if "last_name" in playerInfo.keys() and playerInfo['last_name']:
            playerLastName = playerInfo['last_name'].lower()
        
        found = False
        for profile in game_changers_profiles:
          if profile['id'] == playerId:
            result.append(profile)
            found = True
            break
          elif playerFirstName.strip() == profile['first_name'].lower().strip() and playerLastName.strip() == profile['last_name'].lower().strip():
            result.append(profile)
            found = True
            break
        if found:
          continue
        for profile in vct_international_profiles:
          if profile['id'] == playerId:
            result.append(profile)
            found = True
            break
          elif playerFirstName.strip() == profile['first_name'].lower().strip() and playerLastName.strip() == profile['last_name'].lower().strip():
            result.append(profile)
            found = True
            break
        if found:
          continue
        for profile in vct_challengers_profiles:
          if profile['id'] == playerId:
            result.append(profile)
            found = True
            break
          elif playerFirstName.strip() == profile['first_name'].lower().strip() and playerLastName.strip() == profile['last_name'].lower().strip():
            result.append(profile)
            found = True
            break
      
      
      for profile in result:
        profile["map_statistics"] = sorted(profile["map_statistics"], key=lambda x: (-x["game_count"], -x["acs"]))
      
      map_count = {"Abyss": 0, "Bind": 0, "Haven": 0, "Pearl": 0, "Split": 0, "Sunset": 0, "Ascent": 0}
      for profile in result:
        for i in range(len(profile["map_statistics"])):
          if profile["map_statistics"][i]["map"] in map_count.keys():
            map_count[profile["map_statistics"][i]["map"]] += max(5 - i, 0)
      
      best_map = "Ascent"
      best_map = max(map_count, key=map_count.get)

      best_agents = {
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

      team = []
      roles = ["Flex", "Initiator", "Sentinel", "Controller", "Duelist"]
      chosen_profiles = []
      for role_agents in best_agents[best_map][::-1]:
        for profile in result:
          if profile in chosen_profiles:
            continue
          role = roles.pop()
          if role in profile["roles"]:
            agents = [a["agent"] for a in profile["agent_statistics"]]
            if role != "Flex":
              for agent in role_agents:
                if agent in agents:
                  team.append(agent)
                  chosen_profiles.append(profile)
                  break
            break
          else:
            roles.append(role)

      eligile_agents = [item for sublist in best_agents[best_map] for item in sublist]
      for profile in result:
        if profile in chosen_profiles:
          continue
        agents = [a["agent"] for a in profile["agent_statistics"]]
        for a in agents:
          if a in eligile_agents and a not in team:
            team.append(a)
            chosen_profiles.append(profile)
            break
        

      return {"bestMap": best_map, "agents": team}

    except Exception as err:
      return err
    
  def getMapInformation(event):
    print("Event: ", event)
    requestBody = event['requestBody']['content']['application/json']['properties']

    mapName = ""
    for prop in requestBody:
      if prop['name'] == 'map':
        mapName = prop['value']
        break

    if type(mapName) == object:
      mapName = mapName.get("map", "")
    elif type(mapName) == str:
      mapName = mapName
    else:
      return "Invalid map input format"
    
    try:
      map_metadata = s3.get_object(Bucket=STATIC_BUCKET_NAME, Key=f'maps.json')
      map_content = json.loads(map_metadata['Body'].read().decode('utf-8'))
      
      for m in map_content:
        if m['name'] == mapName:
          d = m['strategic_description']
          words = d.split()
          trimmed_words = words[:4000]
          d = ' '.join(trimmed_words)
          return {"map": mapName, "description": d}
        
      return "Map not found"
    except:
      return "Map not found"
    
  # Read, process request and format response to AI agent
  result = ''
  action_group = event['actionGroup']
  api_path = event['apiPath']
  response_code = 200

  print("api_path: ", api_path) 

  if api_path == '/getSuggestedTeam':
    result = getSuggestedTeam(event)
  elif api_path == '/getPlayersDetailProfile':
    result = getPlayersDetailProfile(event)
  elif api_path == '/getGuideline':
    result = getGuideline(event)
  elif api_path == '/getReplacement':
    result = getReplacement(event)
  elif api_path == '/getBestmap':
    result = getBestmap(event)
  elif api_path == '/getMapInformation':
    result = getMapInformation(event)
  else:
    response_code = 404
    result = f"Unrecognized API path: {action_group}::{api_path}"

  response_body = {
    'application/json': {
      'body': result,
    }
  }

  action_response = {
    'actionGroup': action_group,
    'apiPath': api_path,
    'httpMethod': event['httpMethod'],
    'httpStatusCode': response_code,
    'responseBody': response_body
  }

  api_response = {'messageVersion': '1.0', 'response': action_response}

  return api_response