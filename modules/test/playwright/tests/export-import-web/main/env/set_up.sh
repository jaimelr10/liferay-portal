#!/bin/bash

source $(dirname ${BASH_SOURCE[0]})/../../../../env/common.sh

prepare_additional_bundles 2 "true"

start_additional_bundles 2
