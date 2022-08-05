package hu.elteik.knowledgelab.javaengine.configuration;

import hu.elteik.knowledgelab.javaengine.algorithms.RandomDispersion;
import hu.elteik.knowledgelab.javaengine.algorithms.RandomWithLeaderDispersion;
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
}
