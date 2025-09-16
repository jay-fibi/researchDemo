puts "Welcome to the Number Guessing Game!"
puts "I'm thinking of a number between 1 and 100."

number = rand(1..100)
attempts = 0

loop do
  print "Guess the number: "
  guess = gets.chomp.to_i
  attempts += 1

  if guess == number
    puts "Congratulations! You guessed it in #{attempts} attempts."
    break
  elsif guess < number
    puts "Too low!"
  else
    puts "Too high!"
  end
end
