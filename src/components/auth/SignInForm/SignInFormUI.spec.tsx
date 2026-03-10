import { render, screen } from "@testing-library/react";
import type { UseFormRegister } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import type { SignUpInputType } from "@/@types/SingUpType";
import SignInFormUI from "./SignInFormUI";

describe("SignInFormUI", () => {
  const mockRegister = vi.fn();
  const mockOnSubmit = vi.fn((e) => e.preventDefault());

  const defaultProps = {
    title: "Logística" as const,
    register: mockRegister as unknown as UseFormRegister<SignUpInputType>,
    errors: {},
    onSubmit: mockOnSubmit,
  };

  it("renders correctly with title", () => {
    render(<SignInFormUI {...defaultProps} />);
    expect(screen.getByText("Acesso Logística")).toBeTruthy();
    expect(
      screen.getByText("Digite a senha para acessar o painel de logística"),
    ).toBeTruthy();
  });

  it("renders inputs and submit button", () => {
    render(<SignInFormUI {...defaultProps} />);
    expect(screen.getByPlaceholderText("Email")).toBeTruthy();
    expect(screen.getByPlaceholderText("Senha de acesso")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeTruthy();
  });

  it("displays validation errors when passed via props", () => {
    const errorProps = {
      ...defaultProps,
      errors: {
        email: { type: "required", message: "Email obrigatório" },
        password: { type: "required", message: "Senha obrigatória" },
      },
    };

    render(<SignInFormUI {...errorProps} />);

    expect(screen.getByText("Email obrigatório")).toBeTruthy();
    expect(screen.getByText("Senha obrigatória")).toBeTruthy();
  });
});
