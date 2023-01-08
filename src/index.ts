import { RlCtrnn } from "ctrnn.js";

const DT = 0.05;
const QUEUE_DURATION = 2;
const QUEUE_LENGTH = QUEUE_DURATION / DT;

let ctrnn = new RlCtrnn(2);
ctrnn.setBias(0, -2.75);
ctrnn.setBias(1, -1.75);
ctrnn.setWeight(0, 0, 4.5);
ctrnn.setWeight(0, 1, -1.0);
ctrnn.setWeight(1, 0, 1.0);
ctrnn.setWeight(1, 1, 4.5);

for (const fluxes of ctrnn.fluctuators) {
  for (const flux of fluxes) {
    flux.period_range.min = 6;
    flux.period_range.max = 12;
    flux.randomize_period();
  }
}

let time = 0.0;
let voltages = ctrnn.init_voltage();

let last = [0, 0];
let activityHistory: number[][] = [];
let fitnessHistory: number[][] = [];
let fitnessSums: number[] = [];
let avgFitnessSums: number[] = [];

function tick() {
  while (voltages.length < ctrnn.size) voltages.push(0);
  while (activityHistory.length < ctrnn.size) activityHistory.push([]);
  while (fitnessHistory.length < ctrnn.size) fitnessHistory.push([]);
  while (fitnessSums.length < ctrnn.size) fitnessSums.push(0);
  while (avgFitnessSums.length < ctrnn.size) avgFitnessSums.push(0);

  time += DT;
  voltages = ctrnn.update(DT, voltages);
  let outputs = ctrnn.getOutputs(voltages);

  for (let post = 0; post < ctrnn.size; post++) {
    let activity = Math.abs(outputs[post] - last[post] || 0);
    activityHistory[post].push(activity);
    fitnessSums[post] += activity;
    if (activityHistory[post].length > QUEUE_LENGTH) {
      fitnessSums[post] -= activityHistory[post].shift() || 0;
    }
    let fitness = fitnessSums[post] / QUEUE_LENGTH;

    fitnessHistory[post].push(fitness);
    avgFitnessSums[post] += fitness;
    if (fitnessHistory[post].length > QUEUE_LENGTH) {
      avgFitnessSums[post] -= fitnessHistory[post].shift() || 0;
    }
    let avgFitness = avgFitnessSums[post] / QUEUE_LENGTH;
    let reward = fitness - avgFitness;

    for (let pre = 0; pre < ctrnn.size; pre++) {
      ctrnn.fluctuators[pre][post].update(DT, reward);
    }
  }

  last = outputs;
}
