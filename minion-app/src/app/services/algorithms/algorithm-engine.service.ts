import {Injectable} from '@angular/core';
import {GraphState, NodeState, RobotState} from "../../models/GraphState";

@Injectable({
  providedIn: 'root'
})
export class AlgorithmEngineService {

  constructor() { }

  nextState(graphState: GraphState, algorithmType: string): GraphState {
    switch (algorithmType) {
      case 'random_with_color_constraints': return this.randomWithColorConstraints(graphState);
    }
  }

  randomWithColorConstraints(graphState: GraphState): GraphState {

    if ( !this.isAllNodeOccupied(graphState) ) {

      for (let i = 0; i < graphState.robots.length; i++) {

        if (graphState.robots[i].state !== RobotState.FINISHED) {
          const currentNode = graphState.nodes.find(node => node.id === graphState.robots[i].on);

          if (!currentNode.state || currentNode.state === NodeState.PENDING || currentNode.state === NodeState.VISITED) {

            graphState.robots[i].state = RobotState.FINISHED;
            graphState.nodes.find(node => node.id === currentNode.id).state = NodeState.OCCUPIED;

          } else {
            const options = graphState.edges.filter(edge => edge.from === currentNode.id && edge.color === graphState.robots[i].color || edge.to === currentNode.id && edge.color === graphState.robots[i].color);
            if (options.length > 0) {
              const random = Math.floor(Math.random() * options.length);
              graphState.robots[i].on = options[random].to;
              if (graphState.nodes.find(node => node.id === options[random].to).state !== NodeState.OCCUPIED) {
                graphState.nodes.find(node => node.id === options[random].to).state = NodeState.PENDING;
              };
            }
          }

        }
      }
      return graphState;
    } else {
      return null;
    }
  }

  isAllNodeOccupied(graphState: GraphState): boolean {
  return graphState.nodes.filter(node => node.state === NodeState.OCCUPIED).length === graphState.nodes.length;
  }

}
