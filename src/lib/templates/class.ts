import type { DiagramTemplate } from "./types";

export const classTemplates: DiagramTemplate[] = [
	{
		id: "class-basic",
		name: "Basic Class Structure",
		category: "Class",
		description: "Simple class with properties and methods",
		tags: ["oop", "basic", "class"],
		code: `classDiagram
    class User {
        +String username
        +String email
        +String password
        +login()
        +logout()
        +updateProfile()
    }
    class Post {
        +String title
        +String content
        +Date createdAt
        +create()
        +update()
        +delete()
    }
    User "1" --> "*" Post : creates`,
	},
	{
		id: "class-inheritance",
		name: "Inheritance Example",
		category: "Class",
		description: "Class inheritance and polymorphism",
		tags: ["inheritance", "polymorphism", "oop"],
		code: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
        +eat()
    }
    class Dog {
        +String breed
        +bark()
        +fetch()
    }
    class Cat {
        +String color
        +meow()
        +scratch()
    }
    Animal <|-- Dog
    Animal <|-- Cat`,
	},
	{
		id: "class-interface",
		name: "Interface Implementation",
		category: "Class",
		description: "Interface and implementation pattern",
		tags: ["interface", "implementation", "design"],
		code: `classDiagram
    class PaymentProcessor {
        <<interface>>
        +processPayment()
        +refund()
        +getStatus()
    }
    class CreditCardProcessor {
        +String cardNumber
        +processPayment()
        +refund()
        +getStatus()
    }
    class PayPalProcessor {
        +String email
        +processPayment()
        +refund()
        +getStatus()
    }
    PaymentProcessor <|.. CreditCardProcessor
    PaymentProcessor <|.. PayPalProcessor`,
	},
];
