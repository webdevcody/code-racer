name: Bug Report
description: Create a bug report to help us improve
title: "[BUG]: "
labels:
  - "bug"
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to submit this feature request!

        Please answer the following questions before submitting an issue.

        - [x] I am running the latest version
        - [x] I checked the documentation and found no answer
        - [x] I checked to make sure that this issue has not already been filed

  - type: textarea
    id: description
    attributes:
      label: Description
      description: A clear and concise description of what the bug is.
      placeholder: Try to describe what happened...
    validations:
      required: true

  - type: dropdown
    id: browsers
    attributes:
      label: (optional) What browsers are you seeing the problem on?
      multiple: true
      options:
        - Firefox
        - Chrome
        - Safari
        - Microsoft Edge

  - type: checkboxes
    id: terms
    attributes:
      label: Code of Conduct
      description: By submitting this issue, you agree to follow our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
      options:
        - label: I agree to follow this project's Code of Conduct
          required: true
