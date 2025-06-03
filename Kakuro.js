function permissable(nums, sum) {
    let total = 0;
    for (let i = 0; i < nums.length; i++) {
        total += nums[i];
        if (nums[i] < 1 || nums[i] > 9) {
            return false;
        }
    }

    return total === sum && nums.length === new Set(nums).size;
}

function getValidPermutations(length, targetSum) {
    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const results = [];

    function combine(current, remaining, start) {
        if (current.length === length) {
            if (permissable(current, targetSum)) {
            permute(current, 0);
            }
            return;
        }

        for (let i = start; i < remaining.length; i++) {
            combine([...current, remaining[i]], remaining, i + 1);
        }
    }

    function permute(arr, index) {
        if (index === arr.length - 1) {
            results.push([...arr]);
            return;
        }

        for (let i = index; i < arr.length; i++) {
            [arr[index], arr[i]] = [arr[i], arr[index]];
            permute(arr, index + 1);
            [arr[index], arr[i]] = [arr[i], arr[index]];
        }
    }

    combine([], digits, 0);
    return results;
}

const BLANK = null;
const CLUE = (d, r, [pD, pR], [coordsD, coordsR] ) => ({ down: d, right: r, permsD: pD, permsR: pR, coordsD: coordsD, coordsR: coordsR });
const CELL =  '*';
const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const grid = [
    [BLANK, CLUE(7, 0, [null, null], [null, null]), CLUE(23, 0, [null, null], [null, null]), BLANK, BLANK],
    [CLUE(0, 8, [null, null], [null, null]), CELL, CELL, CLUE(23, 0, [null, null], [null, null]), BLANK],
    [CLUE(0, 20, [null, null], [null, null]), CELL, CELL, CELL, CLUE(16, 0, [null, null], [null, null])],
    [BLANK, CLUE(0, 24, [null, null], [null, null]), CELL, CELL, CELL],
    [BLANK, BLANK, CLUE(0, 17, [null, null], [null, null]), CELL, CELL]
]

for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
        const cell = grid[r][c];
        if (cell === BLANK) continue;

        if (cell.down > 0) {
            let length = 0;
            while (grid[r + 1] && grid[r + 1][c] === CELL) {
                r++;
                length++;
            }
            r -= length;
            const permsD = getValidPermutations(length, cell.down);
            console.log("row:" + r + "col:" + c + "length:" + length + "Perms Down:" + permsD);
            grid[r][c].permsD = permsD;
            grid[r][c].coordsD = [];
            for (let i = 1; i <= length; i++) {
                grid[r][c].coordsD.push([r + i, c]);
            }
            console.log(grid[r][c].coordsD);
        }
        if (cell.right > 0) {
            let length = 0;
            while (grid[r] && grid[r][c + 1] === CELL) {
                c++;
                length++;
            }
            c -= length;
            const permsR = getValidPermutations(length, cell.right);
            console.log("row:" + r + "col:" + c + "length:" + length + "Perms Right:" + permsR);
            grid[r][c].permsR = permsR;
            grid[r][c].coordsR = [];
            for (let i = 1; i <= length; i++) {
                grid[r][c].coordsR.push([r, c + i]);
            }
            console.log(grid[r][c].coordsR);
        }
    }
}

// Prints a grid
function printGrid(grid) {
    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let r = 0; r < grid.length; r++) {
        let row = '';
        for (let c = 0; c < grid[r].length; c++) {
            const cell = grid[r][c];
            if (cell === BLANK) {
                row += ' . ';
            } else if (cell === CELL) {
                row += ' # ';
            } else if (digits.includes(cell)) {
                row += ` ${cell} `;
            } else {
                row += ` ${cell.down},${cell.right} `;
            }
        }
        console.log(row);
    }
}

// Only use this function to check the grid after it has been solved
function checkGrid(grid) {
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            const cell = grid[r][c];
            if (cell === BLANK || cell === CELL) continue;

            if (cell.down > 0) {
                let total = 0;
                let length = 1;
                let set = [];
                while (grid[r + length] && digits.includes(grid[r + length][c])) {
                    if (set.includes(grid[r + length][c])) {
                        return false;
                    }
                    else {
                        set.push(grid[r + length][c]);
                    }
                    total += grid[r + length][c];
                    length++;
                }
                if (total !== cell.down) {
                    return false;
                }
            }
            if (cell.right > 0) {
                let total = 0;
                let length = 1;
                let set = [];
                while (grid[r][c + length] && digits.includes(grid[r][c + length])) {
                    if (set.includes(grid[r][c + length])) {
                        return false;
                    }
                    else {
                        set.push(grid[r][c + length]);
                    }
                    total += grid[r][c + length];
                    length++;
                }
                if (total !== cell.right) {
                    return false;
                }
            }
        }
    }
    return true;
}

// Solve the grid using backtracking
function solveGrid(grid) {
    let clues = [];
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            if (grid[r][c] === BLANK || grid[r][c] === CELL) continue;
            clues.push([r, c]);
        }
    }
    
    function arraysEqual(a, b) {
        return a.length === b.length && a.every((val, i) => val === b[i]);
    }

    function backtrack(index, direction) {
        if (index === clues.length) {
            if (checkGrid(grid)) {
                printGrid(grid);
                return true;
            }
            console.log("Invalid grid");
            printGrid(grid);
            return false;
        }

        const [r, c] = clues[index];
        const cell = grid[r][c];

        if (direction === 0) {
            if (cell.permsD === null) {
                return backtrack(index, 1);
            }

            let current = cell.coordsD.map(([row, col]) => grid[row][col]);

            if (current.includes('*')) {
                let potential = cell.permsD;

                for (let i = 0; i < current.length; i++) {
                    if (current[i] !== '*') {
                        potential = potential.filter(p => p[i] === current[i]);
                    }
                }

                for (let perm of potential) {
                    for (let i = 0; i < perm.length; i++) {
                        grid[cell.coordsD[i][0]][cell.coordsD[i][1]] = perm[i];
                    }
                    if (backtrack(index, 1)) return true;
                    for (let i = 0; i < perm.length; i++) {
                        grid[cell.coordsD[i][0]][cell.coordsD[i][1]] = current[i];
                    }
                }
            } else {
                if (!cell.permsD.some(p => arraysEqual(p, current))) {
                    return false;
                }
                return backtrack(index, 1);
            }
        } else {
            if (cell.permsR === null) {
                return backtrack(index + 1, 0);
            }

            let current = cell.coordsR.map(([row, col]) => grid[row][col]);

            if (current.includes('*')) {
                let potential = cell.permsR;

                for (let i = 0; i < current.length; i++) {
                    if (current[i] !== '*') {
                        potential = potential.filter(p => p[i] === current[i]);
                    }
                }

                for (let perm of potential) {
                    for (let i = 0; i < perm.length; i++) {
                        grid[cell.coordsR[i][0]][cell.coordsR[i][1]] = perm[i];
                    }
                    if (backtrack(index + 1, 0)) return true;
                    for (let i = 0; i < perm.length; i++) {
                        grid[cell.coordsR[i][0]][cell.coordsR[i][1]] = current[i];
                    }
                }
            } else {
                if (!cell.permsR.some(p => arraysEqual(p, current))) {
                    return false;
                }
                return backtrack(index + 1, 0);
            }
        }

        return false;
    }

    return backtrack(0, 0);
}

solveGrid(grid);