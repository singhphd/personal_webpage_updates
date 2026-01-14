---
title: "Radar Data Processing with DCT"
summary: "Advanced noise removal in radar Doppler spectra using Discrete Cosine Transform (DCT) smoothing."
priority: 2
tags: ["Signal Processing", "Radar", "Algorithms", "Python"]
links:
  repo: "https://github.com/JValdivia23/radar-dct-smoothing"
---

## The Challenge

Radar Doppler spectra often contain noise and artifacts that obscure the true microphysical signal. Traditional smoothing techniques can blur sharp features or fail to preserve the spectral peaks associated with hydrometeors.

## The Solution

I implemented a smoothing algorithm based on the **Discrete Cosine Transform (DCT)**. This approach operates in the frequency domain of the spectrum itself, allowing for efficient noise reduction while preserving the structural integrity of the signal.

## Results

- **Improved Signal-to-Noise Ratio:** The DCT method significantly enhances weak signals.
- **Preserved Peak Structure:** Unlike moving average filters, DCT smoothing maintains the width and location of spectral peaks, which is critical for retrieving drop size distributions.
- **Open Source:** The tool is available as an open-source Python package for the radar community.
