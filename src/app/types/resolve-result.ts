/** Liveness of one hostname, as answered by `POST /dns/resolve`. */
export type ResolveStatus = 'active' | 'inactive' | 'error';

export type ResolveResult = {
  name: string;
  status: ResolveStatus;
  addresses: string[];
};
