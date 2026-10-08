
function generateKey(codeInput, keyOutput) {
	// Validate the input format
	const codePattern = /^\d+-01\d+$/;
	if (!codePattern.test(codeInput.value)) {
		keyOutput.innerHTML = "<strong>Invalid code format.</strong>";
		return;
	}

	let X = codeInput.value.split("-")[0] - 0;
	let Y = 1585; // TODO: Make this configurable if other games need it

	let code = codeInput.value.split("-")[1].substring(2) - 0;
	let Z = (code - 2 * X) / 3;

	let key = 3 * Y + 2 * Z;
	keyOutput.innerHTML = "<strong>Key:</strong> " + key;
}

document.addEventListener("DOMContentLoaded", function() {
	const formContainer = document.getElementById("js-key-container");

	// Add text input field for code
	const codeInput = document.createElement("input");
	codeInput.type = "text";
	codeInput.placeholder = "XXXX-01YYYYY";
	formContainer.appendChild(codeInput);

	// Add button to generate key
	const genKeyButton = document.createElement("button");
	genKeyButton.id = "genKey";
	genKeyButton.textContent = "Generate Key";
	formContainer.appendChild(genKeyButton);

	// Add p to display key or error message
	const key = document.createElement("p");
	key.id = "key";
	key.innerHTML = "<em>(Key will appear here)</em>";
	formContainer.appendChild(key);

	genKeyButton.addEventListener("click", function() {
		generateKey(codeInput, key);
	});
});
