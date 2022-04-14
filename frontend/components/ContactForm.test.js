import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm />)
});

test('renders the contact form header', () => {
    render(<ContactForm />);
    const headerElement = screen.queryByText(/Contact Form/i) //console.log to check

    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toBeTruthy();
    expect(headerElement).toHaveTextContent(/contact form/i)
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);

    const firstName = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstName, "123");

    const errorMessage = await screen.findAllByTestId('error'); // await for state change// always use FIND when using await
    expect(errorMessage).toHaveLength(1);

});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);

    const submitButton =  screen.getByRole("button") // there is only one button
    userEvent.click(submitButton);

    await waitFor(() => {
        const errorMessages = screen.queryAllByTestId('error');
        expect(errorMessages).toHaveLength(3);
    })
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);

    const firstName = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstName, "12345");

    const lastName = screen.getByLabelText(/Last Name*/i);
    userEvent.type(lastName, "12345");

    const submitButton =  screen.getByRole("button");
    userEvent.click(submitButton);

    const errorMessages = await screen.findAllByTestId('error');
    expect(errorMessages).toHaveLength(1);


});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />)

    const email = screen.getByLabelText(/email*/i);
    userEvent.type(email, "12345")

    const errorMessage = await screen.findByText(/email must be a valid email address/i);
    expect(errorMessage).toBeInTheDocument();

});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />)

    const submitButton =  screen.getByRole("button");
    userEvent.click(submitButton);

    const errorMessage = await screen.findByText(/lastName is a required field/i);
    expect(errorMessage).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);

    const firstName = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstName, "123455");

    const lastName = screen.getByLabelText(/Last Name*/i);
    userEvent.type(lastName, "12345");

    const email = screen.getByLabelText(/email*/i);
    userEvent.type(email, "12345@gmail.com");

    const submitButton =  screen.getByRole("button");
    userEvent.click(submitButton);

    await waitFor(() => {
        const firstNameDisplay = screen.queryByText("123455");
        const lastNameDisplay = screen.queryByText("12345");
        const emailDisplay = screen.queryByText("12345@gmail.com");
        const messageDisplay = screen.queryByTestId('messageDisplay');
        
        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).not.toBeInTheDocument();
       
    })

    
});

test('renders all fields text when all fields are submitted.', async () => {

    render(<ContactForm />);

    const message = screen.getByLabelText(/message/i);
    userEvent.type(message, "message display")

    const firstName = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstName, "123455");

    const lastName = screen.getByLabelText(/Last Name*/i);
    userEvent.type(lastName, "12345");

    const email = screen.getByLabelText(/email*/i);
    userEvent.type(email, "12345@gmail.com");

    const submitButton =  screen.getByRole("button");
    userEvent.click(submitButton);

    await waitFor(() => {
        const firstNameDisplay = screen.queryByText("123455");
        const lastNameDisplay = screen.queryByText("12345");
        const emailDisplay = screen.queryByText("12345@gmail.com");
        const messageDisplay = screen.queryByText('message display');
        
        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).toBeInTheDocument();
    })
});
