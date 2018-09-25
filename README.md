# Polypane:  (n squared) separate frames with borders implemented in Shadertoy, for `n` an integer > 0.

A template for multiple shaders in one, with borders.

## Purpose and functionality

This shader is really a template for dividing the output coordinate system into n x n tiles, where `n` and `n > 0`, and running different code for each tile.

The code near the top of `mainImage()` transforms the coordinate system so pixels in a given tile are mapped to their corresponding position in the whole window, so the shader can work with a regular coordinate system of `[-0.5, -0.5[` to `[0.5, 0.5[` but determine what code to execute based on the tile index, which is obtained simply from the original fragCoord.xy.

So you can either run the same code in different tiles, or the same code with different parameters, or different code entirely.

##

At the bottom of `mainImage()` is a short section which puts a black border around each tile, inset with a thin white line.   This code is independent of the tiling code.

## Execution

Go to https://www.shadertoy.com/view/4tVcDK and run it fullscreen!
Play with it by changing the values of variables like `tileDim`, `freq`, `rmin`, `k`, `barkRoughness` etc. in `mainImage()`.
`toe` is +/-1 depending on whether the tile index is odd or even, so you can multiply an effect by it to reverse it in some cases.

## Author

John Lynch
Sep. 2018.