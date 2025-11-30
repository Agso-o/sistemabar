package br.com.sistemabar.sistemabar.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping("/")
    public String index() { return "index"; }

    @GetMapping("/login")
    public String login() { return "login"; }

    @GetMapping("/cadastro")
    public String cadastro() { return "cadastro"; }

    @GetMapping("/garcom/painel")
    public String garcomPainel() { return "garcom"; }

    @GetMapping("/admin/painel")
    public String adminPainel() { return "admin"; }

    @GetMapping("/cliente/mesa")
    public String clienteMesa() { return "cliente"; }

    @GetMapping("/admin/qrcode")
    public String qrcodeMesas() { return "qrcode_mesas"; }
}