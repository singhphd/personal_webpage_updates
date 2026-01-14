---
title: "Cloud Top Generating Cells (CTGCs)"
summary: "Building a global database of CTGCs using ground-based radar and developing 3D shape tracking algorithms."
priority: 1
tags: ["Cloud Microphysics", "Radar", "Python", "Big Data"]
image: "/ctgc-placeholder.png"
links:
  repo: "https://github.com/JValdivia23"
---

## Overview

Cloud Top Generating Cells (CTGCs) are small-scale convective elements at the tops of cloud systems that play a crucial role in ice crystal formation and precipitation development. Despite their importance, their global characteristics and lifecycle are not fully understood.

## Key Contributions

- **Global Database:** I am processing years of ground-based radar data from multiple ARM (Atmospheric Radiation Measurement) sites to construct a comprehensive climatology of CTGCs.
- **3D Tracking:** Developing novel algorithms to track these cells in 3D space, allowing for detailed analysis of their lifecycle and evolution.
- **Microphysics:** Investigating the link between CTGC dynamics and ice nucleation processes.

## Technical Approach

Using Python and the Py-ART library, I process raw radar moments to identify and classify generating cells. The workflow involves:

1.  **Data Ingestion:** Handling large volumes of Ka-band and W-band radar data.
2.  **Feature Detection:** Implementing image processing techniques to isolate cells.
3.  **Statistical Analysis:** Deriving properties like fall speed, spectral width, and lifetime.

*(More details coming soon)*
