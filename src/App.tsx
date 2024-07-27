import React, { useState, ChangeEvent, KeyboardEvent } from "react";

import { ReactComponent as Illustration } from "./assets/images/illustration-empty.svg";
import { ReactComponent as Calculator } from "./assets/images/icon-calculator.svg";
const App: React.FC = () => {
  const [amount, setAmount] = useState<string | null>(null);
  const [amountFocus, setAmountFocus] = useState<boolean>(false);
  const [termFocus, setTermFocus] = useState<boolean>(false);
  const [term, setTerm] = useState<string | null>(null);
  const [interestFocus, setInterestFocus] = useState<boolean>(false);
  const [interest, setInterest] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [results, setResults] = useState<JSX.Element | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string>("");
  const [termError, setTermError] = useState<string>("");
  const [interestError, setInterestError] = useState<string>("");
  const [checkboxError, setCheckboxError] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateRepayment();
    }
  };
  const calculateRepayment = () => {
    const principal = parseFloat(amount || "0");
    const annualInterestRate = parseFloat(interest || "0") / 100;
    const termInYears = parseFloat(term || "0");

    let hasError = false;

    if (isNaN(principal) || principal <= 0) {
      setAmountError("This field is required");
      hasError = true;
    } else {
      setAmountError("");
    }

    if (isNaN(annualInterestRate) || annualInterestRate <= 0) {
      setInterestError("This field is required");
      hasError = true;
    } else {
      setInterestError("");
    }

    if (isNaN(termInYears) || termInYears <= 0) {
      setTermError("This field is required");
      hasError = true;
    } else if (termInYears > 40) {
      setTermError("Please enter a valid number");
      hasError = true;
    } else {
      setTermError("");
    }

    if (!selectedOption) {
      setCheckboxError("This field is required");
      hasError = true;
    } else {
      setCheckboxError("");
    }

    if (hasError) {
      setResults(null);
      return;
    }

    const payments = termInYears * 12;

    try {
      let monthlyRepayment, totalRepayments;

      if (selectedOption === "repayment") {
        const monthlyInterestRate = annualInterestRate / 12;

        const numerator =
          monthlyInterestRate * Math.pow(1 + monthlyInterestRate, payments);
        const denominator = Math.pow(1 + monthlyInterestRate, payments) - 1;

        if (denominator === 0) {
          setError("Please enter a valid number");
        }

        monthlyRepayment = (principal * numerator) / denominator;
        totalRepayments = monthlyRepayment * payments;

        if (isNaN(monthlyRepayment) || isNaN(totalRepayments)) {
          setError("Please enter a valid number");
        }
        const formattedMonthlyRepayment = monthlyRepayment.toLocaleString(
          undefined,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        );
        const formattedTotalRepayments = totalRepayments.toLocaleString(
          undefined,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        );
        setResults(
          <div className="results">
            <p className="monthlyResult">
              Your monthly repayment is{" "}
              <span>£{formattedMonthlyRepayment}</span>
            </p>
            <p className="total">
              Total repayments over the term will be{" "}
              <span>£{formattedTotalRepayments}</span>
            </p>
          </div>
        );
      } else if (selectedOption === "interest_only") {
        const monthlyInterestPayment = (principal * annualInterestRate) / 12;
        totalRepayments = monthlyInterestPayment * payments;

        if (isNaN(monthlyInterestPayment) || isNaN(totalRepayments)) {
          setError("Please enter a valid number");
        }
        const formattedMonthlyInterestPayment =
          monthlyInterestPayment.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        const formattedTotalRepayments = totalRepayments.toLocaleString(
          undefined,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        );
        setResults(
          <div className="results">
            <p className="monthlyResult">
              Your monthly interest payment is{" "}
              <span>£{formattedMonthlyInterestPayment}</span>
            </p>
            <p className="total">
              Total interest payments over the term will be{" "}
              <span>£{formattedTotalRepayments}</span>
            </p>
          </div>
        );
      }
    } catch (error) {
      console.error("Error calculating repayments:", error.message);
      setResults(
        <div className="results">
          <p className="error">
            An error occurred while calculating the repayments. Please check
            your input values.
          </p>
        </div>
      );
    }
  };

  const handleClear = () => {
    setAmount("");
    setInterest("");
    setTerm("");
    setSelectedOption("");
    setError(null);
    setResults(null);
    setAmountError("");
    setTermError("");
    setInterestError("");
    setCheckboxError("");
  };
  return (
    <div className="container">
      <article className="calculator">
        <header>
          <h1>Mortgage calculator</h1>
          <button onClick={handleClear}>Clear All</button>
        </header>
        <form onKeyDown={handleKeyDown}>
          <div className="amount">
            <label
              htmlFor="amount"
              className={`${amountError ? "labelError" : ""}`}
            >
              <p>Mortgage Amount </p>
              <span
                className={`${amountFocus ? "focusedAmount" : ""} euroSign`}
              >
                £
              </span>
              <input
                type="number"
                name="amount"
                id="amount"
                value={amount || ""}
                onChange={(e) => setAmount(e.target.value)}
                onFocus={() => setAmountFocus(true)}
                onBlur={() => setAmountFocus(false)}
              ></input>{" "}
            </label>{" "}
            {amountError && <p className="error">{amountError}</p>}
          </div>

          <div className="term-interest">
            <div className="term">
              <label
                htmlFor="term"
                className={`${termError ? "labelError" : ""}`}
              >
                <p>Mortgage Term</p>
                <span className={`${termFocus ? "focusedTerm" : ""}`}>
                  years
                </span>
                <input
                  type="number"
                  name="term"
                  id="term"
                  value={term || ""}
                  onChange={(e) => setTerm(e.target.value)}
                  onFocus={() => setTermFocus(true)}
                  onBlur={() => setTermFocus(false)}
                />
              </label>
              {termError && <p className="error">{termError}</p>}
            </div>
            <div className="interest">
              <label
                htmlFor="interest"
                className={`${interestError ? "labelError" : ""}`}
              >
                <p>Interest Rate</p>
                <span className={`${interestFocus ? "focusedInterest" : ""}`}>
                  %
                </span>
                <input
                  type="number"
                  name="interest"
                  id="interest"
                  value={interest || ""}
                  onChange={(e) => setInterest(e.target.value)}
                  onFocus={() => setInterestFocus(true)}
                  onBlur={() => setInterestFocus(false)}
                />
              </label>
              {interestError && <p className="error">{termError}</p>}
            </div>
          </div>
          <div className="type">
            <p>Mortgage Type</p>
            <label
              className={`${
                selectedOption === "repayment" ? "focusedType" : ""
              }`}
            >
              <input
                type="radio"
                name="payment_option"
                value="repayment"
                checked={selectedOption === "repayment"}
                onChange={handleChange}
              />
              <span className="radio"></span>
              Repayment
            </label>
            <label
              className={`${
                selectedOption === "interest_only" ? "focusedType" : ""
              }`}
            >
              <input
                type="radio"
                name="payment_option"
                value="interest_only"
                checked={selectedOption === "interest_only"}
                onChange={handleChange}
              />
              <span className="radio"></span>
              Interest Only
            </label>
            {checkboxError && <p className="error">{checkboxError}</p>}
          </div>
        </form>
        <footer>
          <button onClick={calculateRepayment}>
            <Calculator />
            <span> Calculate Repayments</span>
          </button>{" "}
          {error && <p className="error">{error}</p>}
        </footer>
      </article>
      {results ? (
        <div className="resultsDescription resultsContainer ">
          <h2>Your results</h2>
          <p>
            Your results are shown below based on the information you provided.
            To adjust the results, edit the form and click"calculate repayments"
            again.
          </p>
          {results}
        </div>
      ) : (
        <article className="resultsDescription">
          <Illustration />
          <h2>Results shown here</h2>
          <p>
            Complete the form and click "calculate repayments" to see what your
            monthly repayments would be.
          </p>
        </article>
      )}
    </div>
  );
};

export default App;
