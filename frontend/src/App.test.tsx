import { render } from "@testing-library/react";
import App from "./App";

//простий тест, який перевіряє у тестовому середовищі, чи не падає App при рендері
test("App renders without crashing", () => {
render(<App />);

expect(true).toBe(true);
});
