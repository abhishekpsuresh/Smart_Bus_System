function FormInput({

  type = "text",

  name,
  value,

  onChange,

  placeholder,

  required = false

}) {

  return (

    <input

      type={type}

      name={name}

      value={value}

      onChange={onChange}

      placeholder={placeholder}

      required={required}

      className="

        w-full
        h-16

        rounded-[22px]

        bg-zinc-900

        border
        border-zinc-700

        px-5

        outline-none

        text-white
        text-[20px]

        focus:border-red-500

        transition-all
        duration-300

      "

    />

  );

}

export default FormInput;