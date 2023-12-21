#!/bin/bash
#
# start devcontainer
#

devpod provider add docker
devpod provider use docker
devpod context set-options -o EXIT_AFTER_TIMEOUT=false
export $(xargs -a .devcontainer/devcontainer.env)
devpod up . --id researchtool --devcontainer-path "./.devcontainer/devcontainer.json"
