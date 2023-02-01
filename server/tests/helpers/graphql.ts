import { createGraphQLServer } from '@/shared/infra/http/app';
import { Dependencies } from '@/shared/infra/http/resolvers';
import { ExecutionResult } from 'graphql';

interface RunQueryBody {
  query: string;
  variables?: Record<string, unknown>;
}

interface RunQueryOptions {
  dependencies: Dependencies;
}

interface RunQueryResponse<T = any> extends Response {
  json(): Promise<T>;
}

export async function runQuery<T = any>(
  body: RunQueryBody,
  opts: RunQueryOptions
): Promise<RunQueryResponse<ExecutionResult<T>>> {
  const server = await createGraphQLServer(opts.dependencies);

  const response = await server.fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: body.query,
      variables: body.variables,
    }),
  });

  return response;
}
