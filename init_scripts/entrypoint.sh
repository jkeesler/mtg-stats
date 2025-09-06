#!/bin/bash

conda init
source ${HOME}/.bashrc
conda activate mtg-stats
python ./api/api.py