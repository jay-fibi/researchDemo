#!/bin/bash
./memory_intensive &
sleep 2
pkill -INT memory_intensive
