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
	{
		id: "class-service-layer",
		name: "Service Layer Architecture",
		category: "Class",
		description: "Layered services with repositories and domain entities",
		tags: ["service", "architecture", "layered", "oop"],
		code: `classDiagram
    class Order {
        +UUID id
        +OrderStatus status
        +Money total
        +List~OrderItem~ items
        +addItem()
        +calculateTotal()
    }
    class OrderItem {
        +UUID productId
        +int quantity
        +Money unitPrice
        +subtotal()
    }
    class OrderService {
        +createOrder()
        +cancelOrder()
        +checkout()
    }
    class PaymentService {
        +authorizePayment()
        +capturePayment()
        +refund()
    }
    class OrderRepository {
        <<interface>>
        +save()
        +findById()
        +findPending()
    }
    class PaymentGateway {
        <<interface>>
        +authorize()
        +capture()
        +refund()
    }

    Order "1" o-- "*" OrderItem : contains
    OrderService --> OrderRepository : uses
    OrderService --> PaymentService : orchestrates
    PaymentService --> PaymentGateway : delegates
    OrderRepository --> Order : persists
    PaymentService --> Order : updates status`,
	},
];
