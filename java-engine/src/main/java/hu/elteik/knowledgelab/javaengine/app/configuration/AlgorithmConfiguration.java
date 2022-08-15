package hu.elteik.knowledgelab.javaengine.app.configuration;

import hu.elteik.knowledgelab.javaengine.algorithms.RandomDispersion;
import hu.elteik.knowledgelab.javaengine.algorithms.RandomWithLeaderDispersion;
import hu.elteik.knowledgelab.javaengine.algorithms.RotorRouterDispersion;
import hu.elteik.knowledgelab.javaengine.algorithms.RotorRouterWithLeaderDispersion;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AlgorithmConfiguration {

    @Bean
    public RandomWithLeaderDispersion randomWithLeaderDispersionConfiguration() {
        return new RandomWithLeaderDispersion();
    }

    @Bean
    public RandomDispersion randomDispersionConfiguration() {
        return new RandomDispersion();
    }
    
    @Bean
    public RotorRouterDispersion rotorRouterDispersionConfigration() {
        return new RotorRouterDispersion();
    }

    @Bean
    public RotorRouterWithLeaderDispersion rotorRouterWithLeaderDispersion() {
        return new RotorRouterWithLeaderDispersion();
    }
    
}
