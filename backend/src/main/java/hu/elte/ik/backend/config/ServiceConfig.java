package hu.elte.ik.backend.config;

import hu.elte.ik.backend.logic.AlgorithmServiceImpl;
import hu.elte.ik.backend.logic.GraphServiceImpl;
import hu.elte.ik.backend.logic.ResultServiceImpl;
import hu.elte.ik.backend.module.algorithm.FaultlessDfsHelper;
import hu.elte.ik.backend.module.algorithm.FaultyDfsHelper;
import hu.elte.ik.backend.module.algorithm.RandomHelper;
import hu.elte.ik.backend.module.algorithm.RandomLeaderHelper;
import hu.elte.ik.backend.module.algorithm.RotorRouterHelper;
import hu.elte.ik.backend.module.algorithm.RotorRouterLeaderHelper;
import hu.elte.ik.backend.module.graph.GraphServiceHelper;
import hu.elte.ik.backend.repository.ResultRepository;
import hu.elte.ik.backend.service.AlgorithmService;
import hu.elte.ik.backend.service.GraphService;
import hu.elte.ik.backend.service.ResultService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ServiceConfig {

  @Bean
  public GraphService graphService(GraphServiceHelper graphServiceHelper) {
    return new GraphServiceImpl(graphServiceHelper);
  }

  @Bean
  public GraphServiceHelper graphServiceHelper() {
    return new GraphServiceHelper();
  }

  @Bean
  public AlgorithmService algorithmService(
    RandomHelper randomHelper,
    RandomLeaderHelper randomLeaderHelper,
    RotorRouterHelper rotorRouterHelper,
    RotorRouterLeaderHelper rotorRouterLeaderHelper,
    FaultlessDfsHelper faultlessDfsHelper,
    FaultyDfsHelper faultyDfsHelper
  ) {
    return new AlgorithmServiceImpl(
      randomHelper,
      randomLeaderHelper,
      rotorRouterHelper,
      rotorRouterLeaderHelper,
      faultlessDfsHelper,
      faultyDfsHelper
    );
  }

  @Bean
  public ResultService resultService(ResultRepository resultRepository) {
    return new ResultServiceImpl(resultRepository);
  }
}
