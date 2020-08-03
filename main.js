var pointer
var memory
var raw_program
var program
var program_i
var output = document.getElementById("output")
var sleep_time = 30

function run() {
  switch(program[program_i]) {
    case "+":
      memory[pointer]++
      if (memory[pointer] == 256) {
        memory[pointer] = 0
      }
      break
    case "-":
      memory[pointer]--
      if (memory[pointer] == -1) {
        memory[pointer] = 255
      }
      break
    case ">":
      pointer++
      if (pointer == memory.length) memory.push(0)
      break
    case "<":
      pointer--
      break
    case ".":
      output.innerText += String.fromCharCode(memory[pointer])
      break
    case "[":
      if (memory[pointer] == 0) {
        var scope_num = 0
        for(var i=program_i+1; i<program.length; i++) {
          if (program[i] == "[") {
            scope_num++
          } else if (program[i] == "]" && scope_num != 0) {
            scope_num--
          } else if (program[i] == "]") {
            program_i = i
            break
          }
        }
      }
      break
    case "]":
      if (memory[pointer] != 0) {
        var scope_num = 0
        for(var i=program_i-1; i>=0; i--) {
          if (program[i] == "]") {
            scope_num++
          } else if (program[i] == "[" && scope_num != 0) {
            scope_num--
          } else if (program[i] == "[") {
            program_i = i
            break
          }
        }
      }
      break
  }
  program_i++
  show()
  if (program_i < program.length) setTimeout(run, sleep_time)
}

function show() {
  var program_elm = document.getElementById("program")
  program_elm.innerHTML = null
  var count_commands = 0
  for (var i=0; i<raw_program.length; i++) {
    var is_command = /[\+\-\>\<\.\,\[\]]/.test(raw_program[i])
    if (count_commands == program_i && is_command) {
      program_elm.innerHTML += `<span class="running">${raw_program[i]}</span>`
    } else {
      program_elm.innerHTML += `<span>${raw_program[i]}</span>`
    }
    if (is_command) count_commands++
  }

  var memory_elm = document.getElementById("memory")
  memory_elm.innerHTML = null
  memory.forEach((value, i)=>{
    if (i == pointer) {
      memory_elm.innerHTML += `<div class="value pointer">${("000" + value).slice(-3)}</div>`
    } else {
      memory_elm.innerHTML += `<div class="value">${("000" + value).slice(-3)}</div>`
    }
  })
}

document.getElementById("run").addEventListener("click", ()=>{
  pointer = 0
  memory = [0]
  raw_program = document.getElementById("input_program").value
  program = raw_program.replace(/[^\+\-\>\<\.\,\[\]]/g, "")
  program_i = 0
  output.innerText = null
  show()
  setTimeout(run, sleep_time)
})