
# Valo Agents REST API

It's a REST API where you can handle valorant agents:
* Create a new agent
* Delete an existing agent
* Get all existing agents
* Get an agent by his id
* Update an existing agent's name, description or role





## Tech Stack

**Server:** AWS Serverless Framework, Node.js, Express

**Database:** Amazon DynamoDB

**Infrastructure:** AWS Lambda, API Gateway, 

### Local development

The easiest way to develop and test your function is to use the `dev` command:

```
serverless dev
```

This will start a local emulator of AWS Lambda and tunnel your requests to and from AWS Lambda, allowing you to interact with your function as if it were running in the cloud.

Now you can invoke the function as before, but this time the function will be executed locally. Now you can develop your function locally, invoke it, and see the results immediately without having to re-deploy.

When you are done developing, don't forget to run `serverless deploy` to deploy the function to the cloud.

## Deployment

To deploy this project make sure you have set your own AWS credentials in serverless local profile, after that just run

```bash
  serverless deploy
```


## API Reference

#### Get all agents

```http
  GET /agents
```

#### Get agent

```http
  GET /agents/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of agent to fetch |

#### Create new agent

```http
  POST /agents
```

| Parameter     | Type     | Description                                                |
| :------------ | :------- | :--------------------------------------------------------- |
| `name`        | `string` | **Required**. Name of the agent                            |
| `description` | `string` | **Required**. Description of the agent                     |
| `role`          | `string` | **Required**. duelist, controller, initiator or sentinel |

#### Update an agent name, description or role

```http
  PATCH /agents
```

| Parameter     | Type     | Description                            |
| :------------ | :------- | :------------------------------------- |
| `name`        | `string` | *Optional*. Name of the agent        |
| `description` | `string` | *Optional*. Description of the agent |
| `role`        | `string` | *Optional*. Id of agent to fetch     |

#### Delete an agent

```http
  DELETE /agents/${id}
```

| Parameter | Type     | Description                            |
| :-------- | :------- | :------------------------------------- |
| `id`      | `string` | **Required**. Id of agent to delete    |


## Usage/Examples

After successful deployment, you can create a new agent by calling the corresponding endpoint:

```
curl --request POST 'https://xxxxxx.execute-api.us-east-1.amazonaws.com/agents' --header 'Content-Type: application/json' --data-raw '{"name": "John", "description": "a black cat that kills with his bazooka", "role": "initiator"}'
```

Which should result in the following response:

```json
{
    "id": "c1e9a777-134e-44c7-b6b6-7c47389028d0",
    "name": "John",
    "role": "initiator",
    "description": "a black cat that kills with his bazooka"
}
```

You can later retrieve the agent by `id` by calling the following endpoint:

```
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/agents/someAgentId
```

Which should result in the following response:

```json
{
    "id": "c1e9a777-134e-44c7-b6b6-7c47389028d0",
    "name": "John",
    "role": "initiator",
    "description": "a black cat that kills with his bazooka"
}
```