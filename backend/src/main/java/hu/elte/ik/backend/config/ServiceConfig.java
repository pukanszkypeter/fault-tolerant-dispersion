package hu.elte.ik.backend.config;

import hu.elte.ik.backend.logic.AlgorithmServiceImpl;
import hu.elte.ik.backend.logic.GraphServiceImpl;
import hu.elte.ik.backend.logic.ResultServiceImpl;
import hu.elte.ik.backend.logic.TestServiceImpl;
import hu.elte.ik.backend.module.algorithm.DfsHelper;
import hu.elte.ik.backend.module.algorithm.RandomHelper;
import hu.elte.ik.backend.module.algorithm.RotorRouterHelper;
import hu.elte.ik.backend.module.graph.GraphServiceHelper;
import hu.elte.ik.backend.repository.BatchRepository;
import hu.elte.ik.backend.repository.ResultRepository;
import hu.elte.ik.backend.service.AlgorithmService;
import hu.elte.ik.backend.service.GraphService;
import hu.elte.ik.backend.service.ResultService;
import hu.elte.ik.backend.service.TestService;
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
    RotorRouterHelper rotorRouterHelper,
    DfsHelper dfsHelper
  ) {
    return new AlgorithmServiceImpl(randomHelper, rotorRouterHelper, dfsHelper);
  }

  @Bean
  public ResultService resultService(ResultRepository resultRepository) {
    return new ResultServiceImpl(resultRepository);
  }

  @Bean
  public TestService testService(
    BatchRepository batchRepository,
    ResultRepository resultRepository,
    AlgorithmServiceImpl algorithmServiceImpl
  ) {
    return new TestServiceImpl(
      batchRepository,
      resultRepository,
      algorithmServiceImpl
    );
  }
}
