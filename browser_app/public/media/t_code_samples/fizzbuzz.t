\% A function that takes number argument (eg \fizzbuzz{15}) and returns a string
\@@let \fizzbuzz >\@@function
	{
	\@@let \num >\@@arg \@@number
	\@@if{\num%15=0}
		\@@return \@@string{FizzBuzz}
	\@@elif{\num%3=0}
		\@@return \@@string{Fizz}
	\@@elif{\num%5=0}
		\@@return \@@string{Buzz}
	\@@else
		\@@return \@@string{\num}
	\@@fi
	}

\@@let \n >\@@number{-20}
\@@loop
	\@@print{\fizzbuzz{\n}}
	\@@let \n >\@@number{\n+1}
\@@repeatif{\n < 101}

\% A more compact version
\@@let \fizzbuzzz >\@@function
	{
	\@@let \num >\@@arg \@@number
	\@@return \@@string{\@@if{\num%15=0}FizzBuzz\@@elif{\num%3=0}Fizz\@@elif{\num%5=0}Buzz\@@else\num\@@fi}
	}

\@@let \n >\@@number{-20}
\@@loop
	\@@print{\fizzbuzzz{\n}}
	\@@let \n >\@@number{\n+1}
\@@repeatif{\n < 101}