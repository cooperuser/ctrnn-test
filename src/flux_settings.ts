import Simulation from "./simulation";
import { writeFileSync } from "fs";
import { join } from "path";

function record(convergenceRate: number, learningRate: number) {
  let data =
    "time,fitnessSums0,fitnessSums1,fitnessSums2,avgFitnessSums0,avgFitnessSums1,avgFitnessSums2";

  for (let i = 0; i < 10; i++) {
    data += run_single(i, convergenceRate, learningRate);
  }

  let conv = (Math.round(convergenceRate * 100) / 100).toFixed(2);
  let learn = (Math.round(learningRate * 100) / 100).toFixed(2);
  writeFileSync(
    join(
      __dirname,
      `../data/convergencerate-${conv}_learningrate-${learn}.csv`
    ),
    data
  );
}

function run_single(
  index: number,
  convergenceRate: number,
  learningRate: number
): string {
  function setParams(sim: Simulation) {
    for (const fluxes of sim.ctrnn.fluctuators) {
      for (const flux of fluxes) {
        flux.convergence_rate = convergenceRate;
        flux.learning_rate = learningRate;
      }
    }
  }

  let sim = new Simulation();
  setParams(sim);

  while (sim.time < 600) {
    sim.tick();

    if (sim.time > 5 && sim.ctrnn.size == 2) {
      sim.ctrnn.addNode(1.0);
      setParams(sim);
    }
  }

  let line = `\n`;
  line += `${index},`;
  line += `${sim.fitnessSums[0]},`;
  line += `${sim.fitnessSums[1]},`;
  line += `${sim.fitnessSums[2] || 0},`;
  line += `${sim.avgFitnessSums[0]},`;
  line += `${sim.avgFitnessSums[1]},`;
  line += `${sim.avgFitnessSums[2] || 0},`;
  return line;
}

export function run() {
  for (let conv = 0; conv <= 2; conv += 0.1) {
    for (let learn = 0; learn <= 2; learn += 0.1) {
      record(conv, learn);
    }
    console.log(`finished conv: ${conv}`);
  }
}
