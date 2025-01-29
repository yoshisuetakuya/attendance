import { render, screen } from "@testing-library/react";
import Login from "@/pages/Login";
import test from "node:test";

test("初期画面が表示されているか確認する", () => {
  render(<Login />);
  });

