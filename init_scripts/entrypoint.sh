#!/bin/bash

conda init
source ${HOME}/.bashrc
conda activate mtg-stats
python ./stats.py