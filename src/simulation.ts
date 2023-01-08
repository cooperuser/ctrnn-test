import { RlCtrnn } from "ctrnn.js";

const DT = 0.05;
const QUEUE_DURATION = 2;
const QUEUE_LENGTH = QUEUE_DURATION / DT;

export default class Simulation {
  ctrnn: RlCtrnn;

  last: number[] = [0, 0];
  activityHistory: number[][] = [];
  fitnessHistory: number[][] = [];
  fitnessSums: number[] = [];
  avgFitnessSums: number[] = [];

  voltages: number[];
  time: number = 0;

  constructor() {
    this.ctrnn = new RlCtrnn(2);
    this.ctrnn.setBias(0, -2.75);
    this.ctrnn.setBias(1, -1.75);
    this.ctrnn.setWeight(0, 0, 4.5);
    this.ctrnn.setWeight(0, 1, -1.0);
    this.ctrnn.setWeight(1, 0, 1.0);
    this.ctrnn.setWeight(1, 1, 4.5);

    for (const fluxes of this.ctrnn.fluctuators) {
      for (const flux of fluxes) {
        flux.period_range.min = 6;
        flux.period_range.max = 12;
        flux.randomize_period();
      }
    }

    this.voltages = this.ctrnn.init_voltage();
  }

  tick() {
    while (this.voltages.length < this.ctrnn.size) this.voltages.push(0);
    while (this.activityHistory.length < this.ctrnn.size)
      this.activityHistory.push([]);
    while (this.fitnessHistory.length < this.ctrnn.size)
      this.fitnessHistory.push([]);
    while (this.fitnessSums.length < this.ctrnn.size) this.fitnessSums.push(0);
    while (this.avgFitnessSums.length < this.ctrnn.size)
      this.avgFitnessSums.push(0);

    this.time += DT;
    this.voltages = this.ctrnn.update(DT, this.voltages);
    let outputs = this.ctrnn.getOutputs(this.voltages);

    for (let post = 0; post < this.ctrnn.size; post++) {
      let activity = Math.abs(outputs[post] - this.last[post] || 0);
      this.activityHistory[post].push(activity);
      this.fitnessSums[post] += activity;
      if (this.activityHistory[post].length > QUEUE_LENGTH) {
        this.fitnessSums[post] -= this.activityHistory[post].shift() || 0;
      }
      let fitness = this.fitnessSums[post] / QUEUE_LENGTH;

      this.fitnessHistory[post].push(fitness);
      this.avgFitnessSums[post] += fitness;
      if (this.fitnessHistory[post].length > QUEUE_LENGTH) {
        this.avgFitnessSums[post] -= this.fitnessHistory[post].shift() || 0;
      }
      let avgFitness = this.avgFitnessSums[post] / QUEUE_LENGTH;
      let reward = fitness - avgFitness;

      for (let pre = 0; pre < this.ctrnn.size; pre++) {
        this.ctrnn.fluctuators[pre][post].update(DT, reward);
      }
    }

    this.last = outputs;
  }
}
