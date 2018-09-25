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

## Licence

The MIT License
Copyright © 2018 John Lynch
Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge,
publish, distribute, sublicense, and/or sell copies of the Software,
and to permit persons to whom the Software is furnished to do so, subject
to the following conditions: The above copyright notice and this permission
notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.