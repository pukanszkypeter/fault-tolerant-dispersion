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
      case 'random_with_leader_with_color_constraints': return this.leaderWithColorConstraint(graphState);
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
            //baj: csak to ba mentek a robotok, fromba nem., amint vissza lép a to nem lesz üres...
            //random kell választania h to vagy from legyen
            let direction = Math.floor(Math.random() * 10)+1;

            if(direction % 2 === 0) {
              const optionsTo = graphState.edges.filter(edge => (edge.to === currentNode.id && edge.color === graphState.robots[i].color));


              if (optionsTo.length > 0) {
                const random = Math.floor(Math.random() * optionsTo.length);
                graphState.robots[i].on = optionsTo[random].from;
                if (graphState.nodes.find(node => node.id === optionsTo[random].from).state !== NodeState.OCCUPIED) {
                  graphState.nodes.find(node => node.id === optionsTo[random].from).state = NodeState.PENDING;
                }

              } else {
                const optionsFrom = graphState.edges.filter(edge => (edge.from === currentNode.id && edge.color === graphState.robots[i].color));

                if (optionsFrom.length > 0) {
                  const randomFrom = Math.floor(Math.random() * optionsFrom.length);
                  graphState.robots[i].on = optionsFrom[randomFrom].to;
                  if (graphState.nodes.find(node => node.id === optionsFrom[randomFrom].to).state !== NodeState.OCCUPIED) {
                    graphState.nodes.find(node => node.id === optionsFrom[randomFrom].to).state = NodeState.PENDING;
                  }
                }

              }

            }else{
              const optionsFrom = graphState.edges.filter(edge => (edge.from === currentNode.id && edge.color === graphState.robots[i].color));

              if (optionsFrom.length > 0) {
                const randomFrom = Math.floor(Math.random() * optionsFrom.length);
                graphState.robots[i].on = optionsFrom[randomFrom].to;
                if (graphState.nodes.find(node => node.id === optionsFrom[randomFrom].to).state !== NodeState.OCCUPIED) {
                  graphState.nodes.find(node => node.id === optionsFrom[randomFrom].to).state = NodeState.PENDING;
                }
              }else {

                const optionsTo = graphState.edges.filter(edge => (edge.to === currentNode.id && edge.color === graphState.robots[i].color));


                if (optionsTo.length > 0) {
                  const random = Math.floor(Math.random() * optionsTo.length);
                  graphState.robots[i].on = optionsTo[random].from;
                  if (graphState.nodes.find(node => node.id === optionsTo[random].from).state !== NodeState.OCCUPIED) {
                    graphState.nodes.find(node => node.id === optionsTo[random].from).state = NodeState.PENDING;
                  }

                }

              }
            }

          }

        }
      }

      return graphState;
    } else {
      return null;
    }
  }


  leaderWithColorConstraint(graphState: GraphState): GraphState {

    if ( !this.isAllNodeOccupied(graphState) ) {

//init
      if(graphState.colorsWithLeaders.length === 0) {
        let colorSet = new Set();

        for (let i = 0; i < graphState.robots.length; i++) {
          colorSet.add(graphState.robots[i].color);
        }
        let colors: string[] = [];
        colorSet.forEach(c => colors.push(c.toString()));

        for (let i = 0; i < colors.length; i++) {
            let robotosWithoutLeader = graphState.robots.filter(rob => rob.color === colors[i]);
          const random = Math.floor(Math.random() * robotosWithoutLeader.length);
          graphState.colorsWithLeaders.push({leaderId: robotosWithoutLeader[random].id, color: colors[i] });
        }
      } else {
        for (let i = 0; i < graphState.colorsWithLeaders.length; i++ ){
          // ha az első leader le tud itt telepedni meg teszi, új leadert választanak és várnak, mivel a leaderük nem vezette őket sehova hanem letelepedett
          const currentLeader = graphState.robots.find(rob => rob.id === graphState.colorsWithLeaders[i].leaderId);
          const currentNode = graphState.nodes.find(node => node.id === currentLeader.on);

          if (!currentNode.state || currentNode.state === NodeState.PENDING || currentNode.state === NodeState.VISITED) {

            //handle robot settling
            graphState.robots.find(rob => rob.id === currentLeader.id ).state = RobotState.FINISHED;
            graphState.nodes.find(node => node.id === currentNode.id).state = NodeState.OCCUPIED;

            //get new leader for that color

            let robotsWithoutLeader = graphState.robots.filter(rob => rob.id !== graphState.colorsWithLeaders[i].leaderId && rob.state !== RobotState.FINISHED && rob.color === graphState.colorsWithLeaders[i].color);
            const random = Math.floor(Math.random() * robotsWithoutLeader.length);

            if (robotsWithoutLeader.length > 0){
              graphState.colorsWithLeaders[i].leaderId = robotsWithoutLeader[random].id;
            }


          } else {
            const rootOptions = graphState.edges.filter(edge => edge.from === currentNode.id && edge.color === currentLeader.color || edge.to === currentNode.id && edge.color === currentLeader.color);

            console.log(rootOptions);

            if (rootOptions.length > 0) {
              const random = Math.floor(Math.random() * rootOptions.length);
              //leader go to the new edge
              graphState.robots.find(rob => rob.id === currentLeader.id ).on = rootOptions[random].to;
              if (graphState.nodes.find(node => node.id === rootOptions[random].to).state !== NodeState.OCCUPIED) {
                graphState.nodes.find(node => node.id === rootOptions[random].to).state = NodeState.PENDING;
              };

              //robots are go after the leader;
              let robotsWithLeader = graphState.robots.filter(rob => rob.state !== RobotState.FINISHED && rob.color === currentLeader.color);

              for(let j = 0 ; j < robotsWithLeader.length ; j ++) {
                graphState.robots.find(rob => rob.id === robotsWithLeader[j].id).on = rootOptions[random].to;
              }
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
