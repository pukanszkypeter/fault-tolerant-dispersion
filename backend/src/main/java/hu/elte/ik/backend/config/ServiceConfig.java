package hu.elte.ik.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import hu.elte.ik.backend.logic.GraphServiceImpl;
import hu.elte.ik.backend.module.graph.GraphServiceHelper;
import hu.elte.ik.backend.service.GraphService;

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
    
}
