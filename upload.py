from os import listdir
from os.path import isfile, join
import csv
import re
import wandb

files = [f for f in listdir("data") if isfile(join("data", f))]

for file in files:
    path = join("data", file)
    match = re.match(".*-([\\d\\.]+)\\.csv", file)
    if not match:
        exit()
    amplitude = float(match.groups()[0])

    with open(path, 'r', newline="") as csvfile:
        reader = csv.DictReader(csvfile, ["time", "a0", "a1", "a2"])
        run = wandb.init(
            project="ctrnn-test",
            config={"amplitude": amplitude}
        )
        if not run:
            exit()
        for i, row in enumerate(reader):
            if i == 0: continue
            time = float(row["time"])
            a0 = float(row["a0"])
            a1 = float(row["a1"])
            a2 = float(row["a2"])
            run.log({
                "time": time,
                "activity0": a0,
                "activity1": a1,
                "activity2": a2,
            })
        run.finish()
