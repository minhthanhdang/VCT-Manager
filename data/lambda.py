import json
import boto3
import random
import xml.etree.ElementTree as ET

def lambda_handler(event, context):

  s3 = boto3.client('s3')
  BUCKET_NAME = 'mtd-vct-players-metadata'
  DETAIL_BUCKET_NAME = 'mtd-vct-players-data'

  def get_request_body_parameter(event):
    print("Event:",  event)


    requestBody = event['requestBody']['content']['application/json']['properties']
    requirements_value = ""
    for prop in requestBody:
      if prop['name'] == 'requirements':
        requirements_value = prop['value']
        break


    try:
      requirements = json.loads(requirements_value)
    except: 
      try: 
        text = "<root>" + requirements_value + "</root>"
        root = ET.fromstring(text)
        requirements = []

        # Iterate through each item and convert to dictionary
        for item in root.findall('item'):
          league = item.find('league').text
          region = item.find('region').text
          requirements.append({'league': league, 'region': region})
      except Exception as err:
        print(err)
        return []

    print("hello", requirements)
    return requirements
  
  def getPotentialProfiles(event):

    requirements = get_request_body_parameter(event)

    profile_groups = []
    total_profiles = 0

    
    requirement_count = len(requirements)
    no_requirement_count = 5 - requirement_count
    
    for requirement in requirements:
      if 'league' in requirement.keys():
        league = requirement['league']
      else:
        league = 'vct-challengers'
      if 'region' in requirement.keys():
        region = requirement['region']
      else:
        region = 'any'
      if league == 'vct-challengers':
        profiles = get_profiles('vct-challengers', region, 4)
        print("Profiles: ", profiles)
        total_profiles += len(profiles)
        profile_groups.append({
          'league': league,
          'region': region,
          'profiles': profiles
        })
      elif league == 'vct-international':
        profiles = get_profiles('vct-international', region, 4)
        print("Profiles: ", profiles)
        total_profiles += len(profiles)
        profile_groups.append({
          'league': league,
          'region': region,
          'profiles': profiles
        })
      elif league == 'game-changers':
        profiles = get_profiles('game-changers', region, 4)
        print("Profiles: ", profiles)
        total_profiles += len(profiles)
        profile_groups.append({
          'league': league,
          'region': region,
          'profiles': profiles
        })

      else:
        leauges = ['vct-challengers', 'vct-international', 'game-changers']
        random_league = random.choice(leauges)
        profiles = get_profiles(random_league, 'any', 4)
        print("Profiles: ", profiles)
        total_profiles += len(profiles)
        profile_groups.append({
          'league': league,
          'region': region,
          'profiles': profiles
        })

    if no_requirement_count > 0:
      for i in range(no_requirement_count):
        leauges = ['vct-challengers', 'vct-international', 'game-changers']
        random_league = random.choice(leauges)
        profiles = get_profiles(random_league, 'any', 4)
        print("Profiles: ", profiles)
        total_profiles += len(profiles)
        profile_groups.append({
          'league': 'vct-international',
          'region': 'any',
          'profiles': profiles
        })

    if total_profiles < 5:
      return "Not enough profiles found"
      
    
    return {"profile_groups": profile_groups}
  
  def get_profiles(league, region, count):
    try:
      response = s3.get_object(Bucket=BUCKET_NAME, Key=f'profiles/{league}/profiles.json')
      file_content = json.loads(response['Body'].read().decode('utf-8'))
      profiles = file_content['players_sort_by_better_acs_first']
      
      eligible_profiles = []

      if not region:
        eligible_profiles = profiles
      elif region.lower() == 'apac':
        eligible_profiles = [profile for profile in profiles if profile['region'].lower() in ['apac', 'kr', 'jpn', 'jp', 'sea', 'vn', 'sa', 'id', 'th', 'hktw', 'sgmy', 'ph']]
      elif region.lower() == 'pacific':
        eligible_profiles = [profile for profile in profiles if profile['region'].lower() in ['pacific', 'apac', 'kr', 'jpn', 'jp', 'sea', 'vn', 'sa', 'id', 'th', 'hktw', 'sgmy', 'ph']]
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
      else:
        eligible_profiles = profiles

      print(len(eligible_profiles))
      chosen_index = random.sample(range(1, max(31, len(eligible_profiles))), 3)

      result = []
      for i in chosen_index:
        result.append(eligible_profiles[i])
      
      return result

    except Exception as err:
      print(err)
      return []
      
  def getPlayersDetailProfile(event):
    requestBody = event['requestBody']['content']['application/json']['properties']

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

          playerInfos.append({'id': id, 'first_name': first_name, 'last_name': last_name})
      except Exception as err:
        print(err)
        return []
      
    try:
      ### LOAD THE DATA ###
      game_changers_metadata = s3.get_object(Bucket=BUCKET_NAME, Key=f'profiles/game-changers/modified_profiles.json')
      vct_international_metadata = s3.get_object(Bucket=BUCKET_NAME, Key=f'profiles/vct-international/modified_profiles.json')
      vct_challengers_metadata = s3.get_object(Bucket=BUCKET_NAME, Key=f'profiles/vct-challengers/modified_profiles.json')
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


  result = ''
  action_group = event['actionGroup']
  api_path = event['apiPath']
  response_code = 200

  print("api_path: ", api_path) 

  if api_path == '/getPotentialProfiles':
    result = getPotentialProfiles(event)
  elif api_path == '/getPlayersDetailProfile':
    result = getPlayersDetailProfile(event)
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