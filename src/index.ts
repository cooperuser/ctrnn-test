import Simulation from "./simulation";
import { writeFileSync } from "fs";
import { join } from "path";

function record(amplitude: number = 0.5) {
  let sim = new Simulation();
  let data = "time,a0,a1,a2";

  while (sim.time < 600) {
    sim.tick();

    if (sim.time > 5 && sim.ctrnn.size == 2) {
      sim.ctrnn.addNode(amplitude);
    }

    let line = `\n`;
    line += `${sim.time},`;
    line += `${sim.avgFitnessSums[0]},`;
    line += `${sim.avgFitnessSums[1]},`;
    line += `${sim.avgFitnessSums[2] || 0},`;
    data += line;
  }

  let amp = (Math.round(amplitude * 100) / 100).toFixed(2);
  writeFileSync(join(__dirname, `../data/amp-${amp}.csv`), data);
}

for (let amp = 0; amp <= 10; amp += 0.1) {
  record(amp);
}
