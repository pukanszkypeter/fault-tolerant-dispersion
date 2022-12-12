export class AlgorithmServiceRoutes {
  public static ALGORITHM_SERVICE = '/algorithm';

  /** ALGORITHM TYPES */
  public static RANDOM = '/random-dispersion';
  public static RANDOM_WITH_LEADER = '/random-with-leader-dispersion';
  public static ROTOR_ROUTER = '/rotor-router-dispersion';
  public static ROTOR_ROUTER_WITH_LEADER =
    '/rotor-router-with-leader-dispersion';
  public static FAULTLESS_DFS = '/faultless-dfs-dispersion';
  public static FAULTY_DFS = '/faulty-dfs-dispersion';

  /** USE CASES */
  public static STEP = '/step';
  public static TEST = '/test';
}
