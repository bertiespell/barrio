import React, { useState } from "react";

import "./App.css";

// const submitForm = () => {
//   const formData = new FormData();
//   formData.append("name", name);
//   formData.append("file", selectedFile);

//   console.log(formData)
//   saveFile(formData)
// };

function App() {
	const [name, setName] = useState("");
	const [selectedFile, setSelectedFile] = useState(null);

	return (
		<div className="App">
			<header className="App-header">
				<p>
					<form>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>

						<input
							type="file"
							value={selectedFile}
							onChange={(e) => setSelectedFile(e.target.files[0])}
						/>
					</form>
				</p>
			</header>
		</div>
	);
}

export default App;
