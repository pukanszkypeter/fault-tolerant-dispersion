package hu.elteik.knowledgelab.javaengine.algorithms.utils;

import hu.elteik.knowledgelab.javaengine.core.models.base.Robot;
import hu.elteik.knowledgelab.javaengine.core.models.rotorrouterwithleaderdispersion.RotorRouterWithLeaderRobot;

import java.util.ArrayList;
import java.util.List;

public class LocalLeaderElection<Object extends Robot> {

    public Object run(List<Object> candidates) {
        if (candidates.size() == 0) {
            throw new RuntimeException("Can not elect leader with 0 candidates!");
        }
        else if (candidates.size() == 1) {
            return candidates.get(0);
        }
        else {
            List<Object> nominees = new ArrayList<>();
            for (Object candidate : candidates) {
                int vote = new RandomNumber().get(0, 1);
                if (vote == 1) {
                    nominees.add(candidate);
                }
            }
            return nominees.size() > 0 ? run(nominees) : run(candidates);
        }
    }

}
