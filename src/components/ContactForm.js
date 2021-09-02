// From https://medium.com/weekly-webtips/simple-react-contact-form-without-back-end-9fa06eff52d9
import React from 'react';
import { useForm } from 'react-hook-form';
import emailjs from 'emailjs-com';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const toastifySuccess = () => {
  toast.success('Message sent!', {
    position: 'bottom-left',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    className: 'submit-feedback success',
    toastId: 'notifyToast'
  });
};

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = async data => {
    const { name, email, subject, message } = data;
    try {
      const templateParams = {
        name,
        email,
        subject,
        message
      };
      await emailjs.send(
        process.env.REACT_APP_SERVICE_ID,
        process.env.REACT_APP_TEMPLATE_ID,
        templateParams,
        process.env.REACT_APP_USER_ID
      );
      reset();
      toastifySuccess();
    } catch (e) {
      console.log(e);
    }
    console.log('Name: ', name);
    console.log('Email: ', email);
    console.log('Subject: ', subject);
    console.log('Message: ', message);
  };

  return (
    <div className="container mx-auto my-5 py-5">
      <h2>Contact JP</h2>
      <div className="container w-full mx-auto">
        <div className="contactForm w-full xl:w-2/3">
          <form className="w-full" id="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="lg:pr-10 pb-5 inline-block w-full md:w-full lg:w-1/2">
              <input
                type="text"
                name="name"
                {...register('name', {
                  required: { value: true, message: 'Please enter your name' },
                  maxLength: {
                    value: 30,
                    message: 'Please use 30 characters or less'
                  }
                })}
                className="form-control formInput w-full "
                placeholder="Name"
              ></input>
              {errors.name && <span className="errorMessage">{errors.name.message}</span>}
            </div>

            <div className=" lg:pr-10 pb-5 inline-block w-full md:w-full lg:w-1/2">
              <input
                type="email"
                name="email"
                {...register('email', {
                  required: true,
                  pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                })}
                className="form-control formInput w-full"
                placeholder="Email address"
              ></input>
              {errors.email && (
                <span className="errorMessage">Please enter a valid email address</span>
              )}
            </div>

            <div className="lg:pr-10 pb-5 w-full">
              <input
                type="text"
                name="subject"
                {...register('subject', {
                  required: { value: true, message: 'Please enter a subject' },
                  maxLength: {
                    value: 75,
                    message: 'Subject cannot exceed 75 characters'
                  }
                })}
                className="form-control formInput w-full"
                placeholder="Subject"
              ></input>
              {errors.subject && <span className="errorMessage">{errors.subject.message}</span>}
            </div>

            <div className="lg:pr-10 pb-5 w-full">
              <textarea
                rows={5}
                name="message"
                {...register('message', {
                  required: true
                })}
                className="form-control formInput w-full"
                placeholder="Message"
              ></textarea>
              {errors.message && <span className="errorMessage">Please enter a message</span>}
            </div>

            <div className="lg:pr-10 pb-5 w-full">
              <button className="submit-btn w-full md:w-1/6" type="submit">
                Send
              </button>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
