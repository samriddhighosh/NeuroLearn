import type { ReactNode } from "react";

export type LessonContentEntry = {
  meta?: { readingTime: string; difficulty: string };
  body: ReactNode;
};

export const contentById: Record<string, LessonContentEntry> = {
  "3.4.1": {
    meta: { readingTime: "25 min read", difficulty: "Advanced" },
    body: (
      <div className="prose prose-lg max-w-none">
        <div className="bg-background-secondary rounded-lg border border-border-primary p-6 lg:p-8 mb-8">
          <h3 className="text-text-primary mb-4 text-heading-md">Deep Learning Models</h3>
          <p className="text-text-secondary mb-4 text-body-md">
            Deep learning models use multiple layers to process information, their design loosely resembling the structure of
            the human brain. Specifically, these models are made of interlinked layers of artificial neurons, where each neuron
            is connected to a neuron in the next layer, making its output the input of the next connected one. Each neuron
            performs mathematical operations that, when combined with other neurons in the network, map an input to an output.
            These connections between multiple layers allow them to recognise complicated patterns as they access more data.
            Two key aspects of this pattern identification process are weights and biases.
          </p>
          <h3 className="text-text-primary mb-4 mt-8 text-heading-md">What are Weighted Sums?</h3>
          <p className="text-text-secondary mb-6 text-body-md">
            Weights or weighted sums are numerical values that are assigned to the different connections between neurons,
            determining how much effect each input has on the neural network's final output. In this way, an input is
            multiplied by its weight before an activation function is applied. Well calibrated weights are vital to ensuring
            the deep learning model is not only able to make accurate predictions, but to be able to generalize those concepts
            to recognize new data.
          </p>
          <h3 className="text-text-primary mb-4 mt-8 text-heading-md">What are Biases?</h3>
          <p className="text-text-secondary mb-6 text-body-md">
            After a neuron receives input from the neurons connected to it, something called a bias is added before an output
            is generated. Biases are "additional parameters" that shift an activation function to fit the data better
            (GeeksforGeeks, "Weights and Bias in Neural Networks"). As a result, biases may allow neurons to activate when the
            weight of the input would normally deem it not to. The network is then able to identify patterns that don't always
            fit a specific input or threshold, giving the neural network a lot more flexibility when presented with a broader
            range of conditions. Updating biases along with weights is important for improving the accuracy of the model's
            predictions.
          </p>
          <h3 className="text-text-primary mb-4 mt-8 text-heading-md">What are Activation Functions?</h3>
          <p className="text-text-secondary mb-6 text-body-md">
            Activation functions are mathematical functions applied to the output of an artificial neuron that allow it to
            learn from and interpret complicated data. Similar to the action potential in a natural neuron, an activation
            function determines if a neuron is activated based on the weighted sums and bias. Without an activation function,
            the model would perform like a statistical machine, finding a straight best fit line for the data. By implementing
            activation functions, deep learning models are able to process non-linearly, making it more suited to decipher real
            world data, complex patterns, and generalizations. This flexibility ensures that these deep learning models can
            handle advanced tasks such as image processing and speech recognition.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
            <p className="text-text-primary text-body-md">
              <strong>Key Concept:</strong> Activation functions enable neural networks to learn non-linear patterns,
              transforming them from simple linear models into powerful tools capable of handling complex real-world data.
            </p>
          </div>
          <h3 className="text-text-primary mb-4 mt-8 text-heading-md">
            How Deep Learning Models Learn From and Process Information
          </h3>
          <p className="text-text-secondary mb-4 text-body-md">
            Neural networks learn through forward propagation and backpropagation, which work together to form and improve
            predictions.
          </p>
          <h3 className="text-text-primary mb-4 mt-8 text-heading-md">Forward Propagation</h3>
          <p className="text-text-secondary mb-4 text-body-md">
            Forward propagation starts with the input of data, which can range anywhere from the values in a dataset to the
            pixels of an image. This data enters the neural networks input layer before each neuron calculates the weighted sum
            of the input, multiplying the input by the weight to determine its influence on the final output. A bias is then
            added to the weighted sum, shifting the activation function and allowing a prediction to be generated even if the
            input value is zero. The sum of the weights and bias then passes through an activation function, which determines
            whether or not the neuron should "fire," sending information to the next layer, or not activate. This process
            continues through the multiple layers of the neural network, with each output becoming the input of another layer
            until a final output is generated.
          </p>
          <p className="text-text-secondary mb-6 text-body-md">
            It is important to note that the adjustment behaviour of weights and biases is done in hidden layers of the neural
            network, meaning there is little to no intuitive explanation for how parameters learned by the model affect the
            output that is actually produced other than a raw mathematical equation. This is why deep learning models may be
            referred to as "black boxes."
          </p>
          <div className="bg-purple-50 border-l-4 border-purple-600 p-4 mb-6">
            <p className="text-text-primary text-body-md">
              <strong>Important Note:</strong> The "black box" nature of deep learning models means that while they can make
              accurate predictions, understanding exactly how they arrive at those predictions can be challenging due to the
              complex interactions in hidden layers.
            </p>
          </div>
        </div>
      </div>
    ),
  },
};
