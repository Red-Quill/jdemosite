\% A simple game with primitive AI

\@@let \Counter >\@@class
	{
	\@@let \value >\@@number{0}

	\@@let \incr >\@@function
		{
		\@@let \**object_value >\@@number{\**object_value+1}
		}

	\@@let \*number >\@@function{\@@return \**object_value}

	\@@let \*string >\@@function{\@@return \@@string{\**object_value}}
	}

\@@let \rpsTable >\@@static
	{
	\@@let \r >\@@number{0}
	\@@let \p >\@@number{1}
	\@@let \s >\@@number{2}
	\@@let \rock >\@@number{0}
	\@@let \paper >\@@number{1}
	\@@let \scissors >\@@number{2}
	\@@let \e >\@@number{-1}
	\@@let \end >\@@number{-1}
	}

\@@let \rpsItems >\@@tuple
	{
	\@@string{Rock}
	\@@string{Paper}
	\@@string{Scissors}
	}

\@@let \computerScore >\Counter:
\@@let \humanScore >\Counter:

\@@let \computerPlayer >\@@object
	{
	\@@let \mem >\@@array
		{
		\@@array{\Counter:\Counter:\Counter:}
		\@@array{\Counter:\Counter:\Counter:}
		\@@array{\Counter:\Counter:\Counter:}
		\@@array{\Counter:\Counter:\Counter:}
		}
	\@@let \prev >\@@number{-1}

	\@@let \inform >\@@function
		{
		\@@let \playerChoice >\@@arg \@@number
		\**object_mem_{\**object_prev}_{\playerChoice}_incr
		\@@let \**object_prev \playerChoice
		}
	
	\@@let \choose >\@@function
		{
		\@@let \afterPrev \**object_mem_{\**object_prev}
		\@@let \choices >\@@list{\@@number{0}}

		\@@if{\afterPrev_{1} > \afterPrev_{0}}
			\@@let \choices_{0} >\@@number{1}
		\@@elif{\afterPrev_{1} = \afterPrev_{0}}
			\@@let \choices_{+} >\@@number{1}
		\@@fi
		\@@if{\afterPrev_{2} >\afterPrev_{\choices_{-1}}}
			\@@let \choices >\@@list{\@@number{2}}
		\@@elif{\afterPrev_{2} = \afterPrev_{\choices_{-1}}}
			\@@let \choices_{+} >\@@number{2}
		\@@fi
		\@@let \n >\@@randint{0 & \@@length \choices–1}
		\@@let \rpsGuess \choices_{\n}
		\@@let \rpsChoice >\@@number{(\rpsGuess+1)%3}

		\@@return \rpsChoice
		}
	}

\@@let \humanPlayer >\@@object
	{
	\@@let \choose >\@@function
		{
		\@@loop
			\@@let \playerInput >\@@prompt{Choose (r)ock, (p)aper, (s)cissors or (e)nd: }
		\@@repeatif{¬ \@@haskey \rpsTable {\playerInput}}
		\@@let \playerChoice \rpsTable_{\playerInput}
		\@@return \playerChoice
		}
	}

\@@let \player >\humanPlayer_choose

\@@loopif{¬(\player=-1)}
	\@@let \computer>\computerPlayer_choose
	\computerPlayer_inform{\player}
	\@@let \playerWord\rpsItems_{\player}
	\@@let \computerWord\rpsItems_{\computer}
	\@@print{You chose \playerWord, Computer chose \computerWord}
	\@@let \result>\@@number{(\player–\computer)%3}
	\@@if{\result=0}
		\@@print{Draw}
	\@@elif{\result=1}
		\humanScore_incr
		\@@print{You win!}
	\@@elif{\result=2}
		\computerScore_incr
		\@@print{You lost you poor thing :(}
	\@@else
		\@@print{WEIRD}
	\@@fi
	\@@print{Score: You: \humanScore, computer: \computerScore}
	\@@let \player >\humanPlayer_choose
\@@repeat