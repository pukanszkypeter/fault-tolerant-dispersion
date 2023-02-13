package hu.elte.ik.backend.module.algorithm.utils;

import java.util.ArrayList;
import java.util.List;

import hu.elte.ik.backend.model.algorithm.Robot;

public class LocalLeaderElection<RobotType extends Robot> {

    public RobotType run(List<RobotType> candidates) {
        if (candidates.size() == 0) {
            throw new RuntimeException("Can not elect leader with 0 candidates!");
        } else if (candidates.size() == 1) {
            return candidates.get(0);
        } else {
            List<RobotType> nominees = new ArrayList<>();
            for (RobotType candidate : candidates) {
                int vote = new RandomNumber().get(0, 1);
                if (vote == 1) {
                    nominees.add(candidate);
                }
            }
            return nominees.size() > 0 ? run(nominees) : run(candidates);
        }
    }

}
