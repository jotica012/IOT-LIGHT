// Pin assignments
int led1Pin = 5;   // LED 1 connected to pin 5
int led2Pin = 6;   // LED 2 connected to pin 6
int sensorPin = A0; // Light sensor connected to analog pin 0


int LedASate = LOW;


int LedBSate = LOW;


void setup() {
  // Initialize the LED pins as output pins
  pinMode(led1Pin, OUTPUT);
  pinMode(led2Pin, OUTPUT);
  
  // Open serial communication for debugging purposes
  Serial.begin(9600);
  
  // Connect to the WebSocket server
  if (client.connect(serverIP, 5050)) {
    Serial.println("Connected to WebSocket server");
    client.println("Hello, server!");
  }
  else {
    Serial.println("Failed to connect to WebSocket server");
  }
}

void loop() {
  // Read the value from the light sensor
  int sensorValue = analogRead(sensorPin);

  
  
  // If the sensor value is greater than a certain threshold, turn on the LEDs
if (Serial.available() > 0) { // Si hay datos disponibles en la comunicación serial
    char data = Serial.read();
     if (data == '1') { 
      LedASate = HIGH; 
    } else if (data == '0') { 
      LedASate = LOW;
    } else if (data == '2'){
      LedBSate = HIGH;
    } else if (data == '3'){
      LedBSate = LOW; 
    }
    digitalWrite(led1Pin, LedASate); 
    digitalWrite(led2Pin, LedBSate); 
  }

  
  // Wait for a short period of time before repeating the loop
  delay(100);
}
