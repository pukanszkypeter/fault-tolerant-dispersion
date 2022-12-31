package engine.app.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import engine.core.generators.GraphGeneratorManager;
import engine.generators.GraphGeneratorManagement;

@Configuration
public class GraphGeneratorConfiguration {

    @Autowired
    private GraphGeneratorManagement graphGeneratorManagement;

    @Bean
    public GraphGeneratorManager graphGeneratorManager() {
        return graphGeneratorManagement;
    }
    
}
